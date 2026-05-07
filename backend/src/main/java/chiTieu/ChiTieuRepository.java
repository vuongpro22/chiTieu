package chiTieu;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ChiTieuRepository extends JpaRepository<chitieu, Long> {
    
    @Query("SELECT c.nguoiMua, SUM(c.giaTien) FROM chitieu c GROUP BY c.nguoiMua")
    List<Object[]> getTotalByBuyer();
    
    @Query("SELECT c.nguoiMua, SUM(c.giaTien) FROM chitieu c WHERE c.nguoiMua = :buyerId GROUP BY c.nguoiMua")
    Object[] getTotalByBuyerId(@Param("buyerId") Integer buyerId);
    
    @Query("SELECT SUM(c.giaTien) FROM chitieu c WHERE c.nguoiMua = :buyerId")
    BigDecimal getTotalAmountByBuyerId(@Param("buyerId") Integer buyerId);
} 