package chiTieu;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChiTieu2Repository extends JpaRepository<ChiTieu2, Long> {
    @Query("SELECT c FROM ChiTieu2 c WHERE c.ngay >= :from AND c.ngay <= :to ORDER BY c.ngay ASC")
    List<ChiTieu2> findByNgayBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    void deleteByNgayBetween(LocalDateTime from, LocalDateTime to);
} 