package chiTieu;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lich_su_chi_tieu")
public class LichSuChiTieu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tu_ngay", nullable = false)
    private LocalDate tuNgay;

    @Column(name = "den_ngay", nullable = false)
    private LocalDate denNgay;

    @Column(name = "tong_chi_tieu", nullable = false)
    private BigDecimal tongChiTieu;

    @Column(name = "tong_vuong", nullable = false)
    private BigDecimal tongVuong;

    @Column(name = "tong_cuong", nullable = false)
    private BigDecimal tongCuong;

    @Column(name = "tong_quan", nullable = false)
    private BigDecimal tongQuan;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getTuNgay() { return tuNgay; }
    public void setTuNgay(LocalDate tuNgay) { this.tuNgay = tuNgay; }

    public LocalDate getDenNgay() { return denNgay; }
    public void setDenNgay(LocalDate denNgay) { this.denNgay = denNgay; }

    public BigDecimal getTongChiTieu() { return tongChiTieu; }
    public void setTongChiTieu(BigDecimal tongChiTieu) { this.tongChiTieu = tongChiTieu; }

    public BigDecimal getTongVuong() { return tongVuong; }
    public void setTongVuong(BigDecimal tongVuong) { this.tongVuong = tongVuong; }

    public BigDecimal getTongCuong() { return tongCuong; }
    public void setTongCuong(BigDecimal tongCuong) { this.tongCuong = tongCuong; }

    public BigDecimal getTongQuan() { return tongQuan; }
    public void setTongQuan(BigDecimal tongQuan) { this.tongQuan = tongQuan; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
} 