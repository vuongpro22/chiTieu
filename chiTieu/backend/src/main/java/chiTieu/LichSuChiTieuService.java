package chiTieu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class LichSuChiTieuService {
    @Autowired
    private LichSuChiTieuRepository repository;

    @Autowired
    private ChiTieu2Repository chiTieu2Repository;

    public LichSuChiTieu save(LichSuChiTieu lichSu) {
        return repository.save(lichSu);
    }

    public List<LichSuChiTieu> findAll() {
        return repository.findAll();
    }

    @Transactional
    public void deleteById(Long id) {
        // Lấy lịch sử để biết khoảng ngày
        LichSuChiTieu lichSu = repository.findById(id).orElse(null);
        if (lichSu != null) {
            LocalDate from = lichSu.getTuNgay();
            LocalDate to = lichSu.getDenNgay();
            LocalDateTime fromDate = from.atStartOfDay();
            LocalDateTime toDate = to.atTime(23,59,59);
            chiTieu2Repository.deleteByNgayBetween(fromDate, toDate);
        }
        repository.deleteById(id);
    }
} 