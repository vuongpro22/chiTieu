package chiTieu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lich-su-chi-tieu")
@CrossOrigin(origins = "*")
public class LichSuChiTieuController {
    @Autowired
    private LichSuChiTieuService service;

    @PostMapping
    public LichSuChiTieu save(@RequestBody LichSuChiTieu lichSu) {
        if (lichSu.getNgayTao() == null) {
            lichSu.setNgayTao(java.time.LocalDateTime.now());
        }
        return service.save(lichSu);
    }

    @GetMapping
    public List<LichSuChiTieu> getAll() {
        return service.findAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @RequestParam("pass") String pass) {
        if (!"251272".equals(pass)) {
            throw new RuntimeException("Sai pass!");
        }
        service.deleteById(id);
    }
} 