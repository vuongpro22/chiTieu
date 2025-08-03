package chiTieu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import chiTieu.LichSuChiTieu;
import chiTieu.LichSuChiTieuService;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/chi-tieu")
@CrossOrigin(origins = "*")
public class ChiTieuController {
    private static final Logger logger = LoggerFactory.getLogger(ChiTieuController.class);

    @Autowired
    private ChiTieuService chiTieuService;
    @Autowired
    private LichSuChiTieuService lichSuChiTieuService;

    @GetMapping
    public List<chitieu> getAllChiTieu() {
        return chiTieuService.getAllChiTieu();
    }

    @PostMapping
    public chitieu createChiTieu(@RequestBody chitieu chiTieu) {
        return chiTieuService.saveChiTieu(chiTieu);
    }

    @DeleteMapping("/clear-all")
    public ResponseEntity<?> deleteAllChiTieu() {
        logger.info("Attempting to delete all records");
        try {
            chiTieuService.deleteAllChiTieu();
            logger.info("Successfully deleted all records");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting all records", e);
            return ResponseEntity.internalServerError().body("Error deleting records: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id:\\d+}") // 👈 CHỈ khớp nếu {id} là số
    public ResponseEntity<?> deleteChiTieu(@PathVariable Long id) {
        chiTieuService.deleteChiTieu(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/lich-su-chi-tieu")
    public LichSuChiTieu saveLichSu(@RequestBody LichSuChiTieu lichSu) {
        if (lichSu.getNgayTao() == null) {
            lichSu.setNgayTao(LocalDateTime.now());
        }
        return lichSuChiTieuService.save(lichSu);
    }

    @GetMapping("/lich-su-chi-tieu")
    public List<LichSuChiTieu> getAllLichSu() {
        return lichSuChiTieuService.findAll();
    }
    
    @GetMapping("/total-by-buyer")
    public List<java.util.Map<String, Object>> getTotalByBuyer() {
        return chiTieuService.getTotalByBuyer();
    }
    
    @GetMapping("/total-by-buyer/{buyerId}")
    public ResponseEntity<?> getTotalByBuyerId(@PathVariable Integer buyerId) {
        java.math.BigDecimal total = chiTieuService.getTotalAmountByBuyerId(buyerId);
        if (total != null) {
            return ResponseEntity.ok(total);
        } else {
            return ResponseEntity.ok(java.math.BigDecimal.ZERO);
        }
    }

    @GetMapping("/chi-tieu2")
    public List<ChiTieu2> getChiTieu2ByDateRange(@RequestParam("from") String from, @RequestParam("to") String to) {
        // from, to dạng yyyy-MM-dd
        LocalDateTime fromDate = LocalDate.parse(from).atStartOfDay();
        LocalDateTime toDate = LocalDate.parse(to).atTime(LocalTime.MAX);
        return chiTieuService.getChiTieu2ByDateRange(fromDate, toDate);
    }
}