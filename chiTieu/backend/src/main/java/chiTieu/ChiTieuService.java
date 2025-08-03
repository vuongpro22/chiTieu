package chiTieu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.math.BigDecimal;
import java.util.Optional;

@Service
public class ChiTieuService {
    
    @Autowired
    private ChiTieuRepository chiTieuRepository;
    
    @Autowired
    private UserService userService;

    @Autowired
    private ChiTieu2Repository chiTieu2Repository;

    public List<chitieu> getAllChiTieu() {
        return chiTieuRepository.findAll();
    }

    public chitieu saveChiTieu(chitieu chiTieu) {
        return chiTieuRepository.save(chiTieu);
    }

    public void deleteChiTieu(Long id) {
        chiTieuRepository.deleteById(id);
    }

    public void deleteAllChiTieu() {
        // Backup all chi_tieu to chi_tieu2
        List<chitieu> all = chiTieuRepository.findAll();
        for (chitieu c : all) {
            ChiTieu2 backup = new ChiTieu2();
            backup.setNgay(c.getNgay());
            backup.setNguoiMua(c.getNguoiMua() != null ? c.getNguoiMua().toString() : null);
            backup.setMoTa(c.getMoTa());
            backup.setGiaTien(c.getGiaTien());
            backup.setVuong(c.getVuong());
            backup.setQuan(c.getQuan());
            backup.setCuong(c.getCuong());
            chiTieu2Repository.save(backup);
        }
        chiTieuRepository.deleteAll();
    }
    
    public List<Map<String, Object>> getTotalByBuyer() {
        List<Object[]> results = chiTieuRepository.getTotalByBuyer();
        List<Map<String, Object>> totals = new java.util.ArrayList<>();
        
        for (Object[] result : results) {
            Integer buyerId = (Integer) result[0];
            BigDecimal total = (BigDecimal) result[1];
            
            Optional<User> user = userService.getUserById(buyerId);
            Map<String, Object> buyerTotal = new HashMap<>();
            buyerTotal.put("buyerId", buyerId);
            buyerTotal.put("buyerName", user.map(User::getFullname).orElse("Unknown"));
            buyerTotal.put("total", total);
            totals.add(buyerTotal);
        }
        
        return totals;
    }
    
    public BigDecimal getTotalAmountByBuyerId(Integer buyerId) {
        return chiTieuRepository.getTotalAmountByBuyerId(buyerId);
    }

    public List<ChiTieu2> getChiTieu2ByDateRange(java.time.LocalDateTime from, java.time.LocalDateTime to) {
        return chiTieu2Repository.findByNgayBetween(from, to);
    }
} 