package com.example.inventory.service;

import com.example.inventory.model.Product;
import com.example.inventory.model.Sale;
import com.example.inventory.repository.ProductRepository;
import com.example.inventory.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayOutputStream;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class ReportService {
    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;

    public ReportService(ProductRepository productRepository, SaleRepository saleRepository) {
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
    }

    public Map<String, Object> stockReport() {
        List<Product> products = productRepository.findAll();
        int totalItems = products.stream().mapToInt(Product::getStockQuantity).sum();
        BigDecimal stockValue = products.stream()
                .map(p -> p.getPrice().multiply(BigDecimal.valueOf(p.getStockQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        List<Map<String, Object>> lowStock = products.stream()
                .filter(p -> p.getStockQuantity() <= p.getThreshold())
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", p.getId());
                    m.put("name", p.getName());
                    m.put("stockQuantity", p.getStockQuantity());
                    m.put("threshold", p.getThreshold());
                    return m;
                })
                .collect(Collectors.toList());
        Map<String, Object> result = new HashMap<>();
        result.put("totalItems", totalItems);
        result.put("stockValue", stockValue);
        result.put("lowStock", lowStock);
        return result;
    }

    public Map<String, Object> salesSummary(String period) {
        Instant now = Instant.now();
        Instant from = switch (period == null ? "daily" : period) {
            case "weekly" -> now.minus(7, ChronoUnit.DAYS);
            case "monthly" -> now.minus(30, ChronoUnit.DAYS);
            default -> now.minus(1, ChronoUnit.DAYS);
        };
        List<Sale> sales = saleRepository.findAll().stream()
                .filter(s -> s.getSaleTime().isAfter(from))
                .collect(Collectors.toList());
        Map<String, Long> productTotals = sales.stream()
                .collect(Collectors.groupingBy(Sale::getProductId, Collectors.summingLong(Sale::getQuantity)));
        String bestProductId = productTotals.entrySet().stream()
                .max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse(null);
        Map<String, Object> result = new HashMap<>();
        result.put("totalSalesCount", sales.size());
        result.put("totalUnitsSold", sales.stream().mapToInt(Sale::getQuantity).sum());
        result.put("bestProductId", bestProductId);
        result.put("productTotals", productTotals);
        return result;
    }

    public byte[] stockReportExcel() {
        List<Product> products = productRepository.findAll();
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Stock");
            int r = 0;
            Row header = sheet.createRow(r++);
            header.createCell(0).setCellValue("Name");
            header.createCell(1).setCellValue("Category");
            header.createCell(2).setCellValue("Price");
            header.createCell(3).setCellValue("Stock");
            header.createCell(4).setCellValue("Threshold");
            for (Product p : products) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(p.getName());
                row.createCell(1).setCellValue(p.getCategory());
                Cell priceCell = row.createCell(2);
                priceCell.setCellValue(p.getPrice() != null ? p.getPrice().doubleValue() : 0);
                row.createCell(3).setCellValue(p.getStockQuantity());
                row.createCell(4).setCellValue(p.getThreshold());
            }
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Excel", e);
        }
    }

    public byte[] salesSummaryExcel(String period) {
        Map<String, Object> summary = salesSummary(period);
        Map<String, Long> totals = (Map<String, Long>) summary.getOrDefault("productTotals", Map.of());
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Sales");
            int r = 0;
            Row header = sheet.createRow(r++);
            header.createCell(0).setCellValue("ProductId");
            header.createCell(1).setCellValue("UnitsSold");
            for (Map.Entry<String, Long> entry : totals.entrySet()) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(entry.getKey());
                row.createCell(1).setCellValue(entry.getValue());
            }
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Excel", e);
        }
    }

    public byte[] stockReportPdf() {
        List<Product> products = productRepository.findAll();
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph("Stock Report"));
            for (Product p : products) {
                document.add(new Paragraph(
                        String.format("%s | %s | price: %s | stock: %d | threshold: %d",
                                p.getName(), p.getCategory(),
                                p.getPrice() != null ? p.getPrice().toPlainString() : "0",
                                p.getStockQuantity(), p.getThreshold())));
            }
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create PDF", e);
        }
    }

    public byte[] salesSummaryPdf(String period) {
        Map<String, Object> summary = salesSummary(period);
        Map<String, Long> totals = (Map<String, Long>) summary.getOrDefault("productTotals", Map.of());
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph("Sales Summary"));
            for (Map.Entry<String, Long> entry : totals.entrySet()) {
                document.add(new Paragraph(entry.getKey() + ": " + entry.getValue()));
            }
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create PDF", e);
        }
    }
}

