package chiTieu;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "chi_tieu2")
public class ChiTieu2 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ngay", nullable = false)
    private LocalDateTime ngay;

    @Column(name = "nguoi_mua", nullable = false)
    private String nguoiMua;

    @Column(name = "mo_ta", nullable = false)
    private String moTa;

    @Column(name = "gia_tien", nullable = false)
    private BigDecimal giaTien;

    @Column(name = "vuong", nullable = false)
    private Boolean vuong = false;

    @Column(name = "quan", nullable = false)
    private Boolean quan = false;

    @Column(name = "cuong", nullable = false)
    private Boolean cuong = false;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getNgay() { return ngay; }
    public void setNgay(LocalDateTime ngay) { this.ngay = ngay; }

    public String getNguoiMua() { return nguoiMua; }
    public void setNguoiMua(String nguoiMua) { this.nguoiMua = nguoiMua; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }

    public BigDecimal getGiaTien() { return giaTien; }
    public void setGiaTien(BigDecimal giaTien) { this.giaTien = giaTien; }

    public Boolean getVuong() { return vuong; }
    public void setVuong(Boolean vuong) { this.vuong = vuong; }

    public Boolean getQuan() { return quan; }
    public void setQuan(Boolean quan) { this.quan = quan; }

    public Boolean getCuong() { return cuong; }
    public void setCuong(Boolean cuong) { this.cuong = cuong; }
} 