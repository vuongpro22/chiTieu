CREATE TABLE `chi_tieu` (
   `id` bigint NOT NULL AUTO_INCREMENT,
   `gia_tien` decimal(38,2) NOT NULL,
   `mo_ta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
   `ngay` datetime(6) NOT NULL,
   `nguoi_mua` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
   PRIMARY KEY (`id`)
)
ALTER TABLE chi_tieu
ADD COLUMN vuong BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN quan BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN cuong BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE `chi_tieu` (
   `id` bigint NOT NULL AUTO_INCREMENT,
   `gia_tien` decimal(38,2) NOT NULL,
   `mo_ta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
   `ngay` datetime(6) NOT NULL,
   `nguoi_mua` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
   PRIMARY KEY (`id`)
)
-- Lịch sử chi tiêu
CREATE TABLE lich_su_chi_tieu (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tu_ngay DATE NOT NULL,
  den_ngay DATE NOT NULL,
  tong_chi_tieu DECIMAL(38,2) NOT NULL,
  tong_vuong DECIMAL(38,2) NOT NULL,
  tong_cuong DECIMAL(38,2) NOT NULL,
  tong_quan DECIMAL(38,2) NOT NULL,
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User
CREATE TABLE user (
  id int primary key,
  fullname varchar(20) NOT NULL,
  username varchar(10) NOT NULL,
  pass varchar(10) NOT NULL
);
INSERT INTO user (id, fullname, username, pass)
VALUES
(1,'vuong','vuong','vuong123'),
(2,'quan','quan','quan123'),
(3,'cuong','cuong','cuong123');

ALTER TABLE chi_tieu
MODIFY COLUMN nguoi_mua INT NOT NULL;
ALTER TABLE chi_tieu
ADD CONSTRAINT fk_nguoi_mua FOREIGN KEY (nguoi_mua) REFERENCES user(id);


CREATE TABLE chi_tieu2 (
   id bigint NOT NULL AUTO_INCREMENT  PRIMARY KEY,
   gia_tien decimal(38,2) NOT NULL,
   mo_ta varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
   ngay datetime(6) NOT NULL,
   nguoi_mua varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
);
ALTER TABLE chi_tieu2
ADD COLUMN vuong BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN quan BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN cuong BOOLEAN NOT NULL DEFAULT FALSE;