import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  InputNumber,
  Space,
  Typography,
  Card,
  DatePicker,
  Row,
  Col,
  Form,
  Popconfirm,
  Modal,
  Checkbox,
  Divider,
  Tag,
  Spin,
  Select,
  Dropdown,
  Menu
} from 'antd';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import axios from 'axios';
import Cookies from 'js-cookie';
import { showErrorToast, showSuccessToast, showWarningToast } from './toast/notification';
import {
  PlusOutlined,
  DeleteOutlined,
  LogoutOutlined,
  DollarCircleOutlined,
  HistoryOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
  FileTextOutlined,
  MoreOutlined
} from '@ant-design/icons';
import './chitieu.css';

dayjs.extend(minMax);

// const API_URL = 'http://localhost:8080/api/chi-tieu';
// const USER_API_URL = 'http://localhost:8080/api/user';
// const HISTORY_API_URL = 'http://localhost:8080/api/lich-su-chi-tieu';
const API_URL = '/api/chi-tieu';
const USER_API_URL = '/api/user';
const HISTORY_API_URL= '/api/lich-su-chi-tieu';

const CLEAR_ALL_PIN = '251272';
const COOKIE_NAME = 'chiTieuLogin';

const ChiTieu = () => {
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null);
  const [date, setDate] = useState(dayjs());
  const [buyer, setBuyer] = useState(null);
  const [vuong, setVuong] = useState(false);
  const [quan, setQuan] = useState(false);
  const [cuong, setCuong] = useState(false);
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isClearAll, setIsClearAll] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [users, setUsers] = useState([]);
  const [buyerTotals, setBuyerTotals] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [historyDeleteId, setHistoryDeleteId] = useState(null);
  const [historyDeletePin, setHistoryDeletePin] = useState('');
  const [isHistoryDeleteModalVisible, setIsHistoryDeleteModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [detailRange, setDetailRange] = useState({ from: null, to: null });

  useEffect(() => {
    const savedLogin = Cookies.get(COOKIE_NAME);
    const savedUser = localStorage.getItem('chiTieuUser');
    if (savedLogin === 'true' && savedUser) {
      setIsLoggedIn(true);
      setLoginModalVisible(false);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchItems();
      fetchUsers();
      fetchBuyerTotals();
    }
  }, [isLoggedIn]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(USER_API_URL);
      setUsers(response.data);
    } catch (error) {
      showErrorToast('Lỗi khi tải danh sách người dùng');
    }
  };

  const fetchBuyerTotals = async () => {
    try {
      const response = await axios.get(`${API_URL}/total-by-buyer`);
      setBuyerTotals(response.data);
    } catch (error) {
      showErrorToast('Lỗi khi tải tổng chi tiêu theo người mua');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${USER_API_URL}/login`, {
        username: username,
        password: password
      });
      
      if (response.data.success) {
        setIsLoggedIn(true);
        setLoginModalVisible(false);
        setCurrentUser(response.data.user);
        Cookies.set(COOKIE_NAME, 'true', { expires: 7 });
        localStorage.setItem('chiTieuUser', JSON.stringify(response.data.user));
        showSuccessToast('Đăng nhập thành công');
      } else {
        showErrorToast(response.data.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (error) {
      showErrorToast('Lỗi khi đăng nhập');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginModalVisible(true);
    setUsername('');
    setPassword('');
    setItems([]);
    setCurrentUser(null);
    Cookies.remove(COOKIE_NAME);
    localStorage.removeItem('chiTieuUser');
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      const itemsWithKey = response.data.map(item => ({
        ...item,
        key: item.id
      }));
      // Sắp xếp theo ngày, mới nhất ở trên cùng
      const sortedItems = itemsWithKey.sort((a, b) => new Date(b.ngay) - new Date(a.ngay));
      setItems(sortedItems);
    } catch (error) {
      showErrorToast('Lỗi khi tải dữ liệu');
    }
  };

  const columns = [
    {
      title: <span><CalendarOutlined style={{ color: '#1890ff', marginRight: 4 }} />Ngày</span>,
      dataIndex: 'ngay',
      key: 'ngay',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      responsive: ['xs'],
    },
    {
      title: <span><UserOutlined style={{ color: '#fa8c16', marginRight: 4 }} />Người mua</span>,
      dataIndex: 'nguoiMua',
      key: 'nguoiMua',
      responsive: ['sm'],
      render: (buyerId) => {
        const user = users.find(u => u.id === buyerId);
        return user ? user.fullname : `User ${buyerId}`;
      }
    },
    {
      title: <span><EditOutlined style={{ color: '#52c41a', marginRight: 4 }} />Mô tả</span>,
      dataIndex: 'moTa',
      key: 'moTa',
    },
    {
      title: <span><UserOutlined style={{ color: '#fa8c16', marginRight: 4 }} />Người dùng</span>,
      key: 'users',
      render: (_, record) => (
        <div>
          {Boolean(Number(record.vuong)) && <Tag color="blue">Vương</Tag>}
          {Boolean(Number(record.quan)) && <Tag color="green">Quân</Tag>}
          {Boolean(Number(record.cuong)) && <Tag color="orange">Cường</Tag>}
        </div>
      ),
    },
    {
      title: <span><DollarCircleOutlined style={{ color: '#d4380d', marginRight: 4 }} />Giá tiền</span>,
      dataIndex: 'giaTien',
      key: 'giaTien',
      render: (price, record) => (
        <span>
          {price.toLocaleString('vi-VN')} VNĐ
          <br />
          <small style={{ color: '#666' }}>{dayjs(record.ngay).format('DD/MM/YYYY')}</small>
        </span>
      ),
    },
    {
      title: <span><ToolOutlined style={{ color: '#722ed1', marginRight: 4 }} />Thao tác</span>,
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleDelete(record.id)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const handleAdd = async () => {
    if (description && price && date && currentUser) {
      try {
        const newItem = {
          ngay: date.format('YYYY-MM-DDTHH:mm:ss'),
          nguoiMua: currentUser.id,
          moTa: description,
          giaTien: price,
          vuong: vuong,
          quan: quan,
          cuong: cuong,
        };
        
        await axios.post(API_URL, newItem);
        showSuccessToast('Thêm thành công');
        fetchItems();
        fetchBuyerTotals();
        setDescription('');
        setPrice(null);
        setDate(dayjs());
        setVuong(false);
        setQuan(false);
        setCuong(false);
      } catch (error) {
        showErrorToast('Lỗi khi thêm dữ liệu');
      }
    } else {
      showWarningToast('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleDelete = async (id) => {
    setItemToDelete(id);
    setIsClearAll(false);
    showPinModal();
  };

  const handleClearAll = async () => {
    setItemToDelete(null);
    setIsClearAll(true);
    showPinModal();
  };

  const showPinModal = () => {
    setIsPinModalVisible(true);
  };

  const handlePinSubmit = async () => {
    if (pinInput === CLEAR_ALL_PIN) {
      if (isClearAll) {
        try {
          console.log('Attempting to clear all data...');
          const response = await axios.delete(`${API_URL}/clear-all`);
          console.log('Clear all response:', response);
          showSuccessToast('Đã xóa tất cả dữ liệu');
          fetchItems();
          fetchBuyerTotals();
        } catch (error) {
          console.error('Error clearing all data:', error);
          showErrorToast('Lỗi khi xóa dữ liệu: ' + (error.response?.data?.message || error.message));
        }
      } else if (itemToDelete) {
        try {
          await axios.delete(`${API_URL}/${itemToDelete}`);
          showSuccessToast('Xóa thành công');
          fetchItems();
          fetchBuyerTotals();
        } catch (error) {
          showErrorToast('Lỗi khi xóa dữ liệu');
        }
      }
      setIsPinModalVisible(false);
      setPinInput('');
      setItemToDelete(null);
      setIsClearAll(false);
    } else {
      showErrorToast('PIN không đúng');
      setPinInput('');
    }
  };

  const handlePinCancel = () => {
    setIsPinModalVisible(false);
    setPinInput('');
    setItemToDelete(null);
    setIsClearAll(false);
  };

  const total = items.reduce((sum, item) => sum + Number(item.giaTien), 0);

  // Tính tiền riêng cho từng người
  const calculatePersonalExpenses = () => {
    const personalExpenses = {
      vuong: 0,
      quan: 0,
      cuong: 0
    };

    items.forEach(item => {
      const itemPrice = Number(item.giaTien);
      const users = [];
      if (item.vuong) users.push('vuong');
      if (item.quan) users.push('quan');
      if (item.cuong) users.push('cuong');

      if (users.length > 0) {
        const pricePerPerson = itemPrice / users.length;
        users.forEach(user => {
          personalExpenses[user] += pricePerPerson;
        });
      }
    });

    return personalExpenses;
  };

  const personalExpenses = calculatePersonalExpenses();

  // Hàm lấy khoảng ngày
  const getDateRange = () => {
    if (items.length === 0) return [null, null];
    const dates = items.map(i => dayjs(i.ngay));
    const min = dayjs.min(dates);
    const max = dayjs.max(dates);
    return [min, max];
  };

  // Hàm thanh toán
  const handleThanhToan = async () => {
    if (items.length === 0) {
      showWarningToast('Không có dữ liệu để thanh toán!');
      return;
    }
    const [minDate, maxDate] = getDateRange();
    const payload = {
      tuNgay: minDate.format('YYYY-MM-DD'),
      denNgay: maxDate.format('YYYY-MM-DD'),
      tongChiTieu: personalExpenses.vuong + personalExpenses.quan + personalExpenses.cuong,
      tongVuong: personalExpenses.vuong,
      tongQuan: personalExpenses.quan,
      tongCuong: personalExpenses.cuong
    };
    try {
      await axios.post(`${HISTORY_API_URL}`, payload);
      showSuccessToast('Đã lưu lịch sử thanh toán!');
      fetchHistory();
    } catch (e) {
      showErrorToast('Lỗi khi lưu lịch sử!');
    }
  };

  // Hàm lấy lịch sử
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(`${HISTORY_API_URL}`);
      setHistoryData(res.data);
    } catch (e) {
      showErrorToast('Lỗi khi tải lịch sử!');
    }
    setLoadingHistory(false);
  };

  // Hàm mở modal lịch sử
  const openHistoryModal = () => {
    fetchHistory();
    setIsHistoryModalVisible(true);
  };

  // Hàm đóng modal lịch sử
  const closeHistoryModal = () => {
    setIsHistoryModalVisible(false);
  };

  // Hàm xóa lịch sử thanh toán
  const handleDeleteHistory = (id) => {
    setHistoryDeleteId(id);
    setIsHistoryDeleteModalVisible(true);
    setHistoryDeletePin('');
  };

  const handleHistoryDeleteConfirm = async () => {
    if (historyDeletePin === '251272') {
      try {
        await axios.delete(`${HISTORY_API_URL}/${historyDeleteId}?pass=251272`);
        showSuccessToast('Xóa lịch sử thành công!');
        setIsHistoryDeleteModalVisible(false);
        setHistoryDeleteId(null);
        setHistoryDeletePin('');
        fetchHistory();
      } catch (e) {
        showErrorToast('Lỗi khi xóa lịch sử!');
      }
    } else {
      showErrorToast('PIN không đúng!');
      setHistoryDeletePin('');
    }
  };

  const handleHistoryDeleteCancel = () => {
    setIsHistoryDeleteModalVisible(false);
    setHistoryDeleteId(null);
    setHistoryDeletePin('');
  };

  // Hàm mở chi tiết lịch sử
  const openDetailModal = async (record) => {
    setDetailRange({ from: record.tuNgay, to: record.denNgay });
    setIsDetailModalVisible(true);
    setDetailData([]);
    try {
      const res = await axios.get(`${API_URL}/chi-tieu2`, {
        params: {
          from: dayjs(record.tuNgay).format('YYYY-MM-DD'),
          to: dayjs(record.denNgay).format('YYYY-MM-DD'),
        },
      });
      setDetailData(res.data);
    } catch (e) {
      showErrorToast('Lỗi khi tải chi tiết!');
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
    setDetailData([]);
  };

  // Dropdown menu for mobile actions
  const mobileMenu = (
    <Menu>
      <Menu.Item key="history" icon={<HistoryOutlined />} onClick={openHistoryModal}>
        Lịch sử thanh toán
      </Menu.Item>
      <Menu.Item key="pay" icon={<DollarCircleOutlined />} onClick={handleThanhToan}>
        Thanh toán
      </Menu.Item>
      <Menu.Item key="deleteall" icon={<DeleteOutlined />} danger>
        <Popconfirm
          title="Xóa tất cả"
          description="Bạn có chắc chắn muốn xóa tất cả dữ liệu?"
          onConfirm={handleClearAll}
          okText="Có"
          cancelText="Không"
        >
          Xóa tất cả
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  if (!isLoggedIn) {
    return (
      <Modal
        title="Đăng nhập"
        open={loginModalVisible}
        onOk={handleLogin}
        onCancel={() => {}}
        okText="Đăng nhập"
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
        maskClosable={false}
      >
        <Form layout="vertical">
          <Form.Item label="Tên đăng nhập">
            <Input
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onPressEnter={() => document.getElementById('password').focus()}
            />
          </Form.Item>
          <Form.Item label="Mật khẩu">
            <Input.Password
              id="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={handleLogin}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  return (
    <div className="ctt-layout">
      <div className="ctt-sidebar">
        <div className="ctt-sidebar-header">
                    <span className="ctt-app-title">Quản lý chi tiêu</span>
        </div>
        <Card className="ctt-add-card">
          <div className="ctt-add-title">
            <PlusOutlined /> Thêm chi tiêu mới
          </div>
          <Form layout="vertical">
            <Form.Item label={<span><CalendarOutlined /> Ngày</span>}>
              <DatePicker
                value={date}
                onChange={setDate}
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label={<span><UserOutlined /> Người mua</span>}>
              <Input
                value={currentUser?.fullname || ''}
                disabled
              />
            </Form.Item>
            <Form.Item label={<span><EditOutlined /> Mô tả</span>}>
              <Input
                placeholder="Nhập mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>
            <Form.Item label={<span><DollarCircleOutlined /> Giá tiền</span>}>
              <InputNumber
                placeholder="Nhập số tiền"
                value={price}
                onChange={setPrice}
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item label="Người sử dụng">
              <Checkbox checked={vuong} onChange={(e) => setVuong(e.target.checked)}>
                Vương
              </Checkbox>
              <Checkbox checked={quan} onChange={(e) => setQuan(e.target.checked)}>
                Quân
              </Checkbox>
              <Checkbox checked={cuong} onChange={(e) => setCuong(e.target.checked)}>
                Cường
              </Checkbox>
            </Form.Item>
            <Button type="primary" block icon={<PlusOutlined />} onClick={handleAdd} className="ctt-btn-add">
              Thêm chi tiêu
            </Button>
          </Form>
        </Card>
      </div>
      <div className="ctt-main">
        <div className="ctt-header">
          <div className="ctt-header-left"></div>
          <div className="ctt-header-user">
            <UserOutlined />
            <span>Xin chào: <b>{currentUser?.fullname || ''}</b></span>
            <Button danger icon={<LogoutOutlined />} onClick={handleLogout} className="ctt-btn-logout">Đăng xuất</Button>
          </div>
        </div>
        <div className="ctt-content">
          <Card className="ctt-list-card">
            <div className="ctt-list-header">
              <span className="ctt-list-title">Danh sách chi tiêu</span>
              <div className="ctt-list-actions">
                <div className="ctt-list-actions-desktop">
                  <Button icon={<HistoryOutlined />} onClick={openHistoryModal}>Lịch sử thanh toán</Button>
                  <Button type="primary" icon={<DollarCircleOutlined />} onClick={handleThanhToan}>Thanh toán</Button>
                  <Popconfirm
                    title="Xóa tất cả"
                    description="Bạn có chắc chắn muốn xóa tất cả dữ liệu?"
                    onConfirm={handleClearAll}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button danger icon={<DeleteOutlined />} style={{ marginLeft: 8, fontWeight: 600, borderRadius: 8 }}>
                      Xóa tất cả
                    </Button>
                  </Popconfirm>
                </div>
                <div className="ctt-list-actions-mobile">
                  <Dropdown overlay={mobileMenu} trigger={["click"]} placement="bottomRight">
                    <Button icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={items}
              pagination={false}
              scroll={{ x: true }}
              locale={{
                emptyText: (
                  <div className="ctt-empty">
                    <FileTextOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                    <div style={{ marginTop: 8, color: '#888', fontWeight: 500 }}>Chưa có dữ liệu</div>
                    <div style={{ color: '#bfbfbf', fontSize: 13 }}>Thêm chi tiêu đầu tiên của bạn</div>
                  </div>
                )
              }}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={columns.length - 2}>
                    <span style={{ fontWeight: 600 }}>Tổng cộng</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={columns.length - 2} colSpan={2}>
                    <span style={{ color: '#389e0d', fontWeight: 700, fontSize: 18 }}>
                      <DollarCircleOutlined /> {total.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Card>
          <div className="ctt-buyer-totals-row">
            {buyerTotals.map((buyerTotal, index) => (
              <Card className="ctt-buyer-total-card" key={buyerTotal.buyerId}>
                <div className="ctt-buyer-total-title">
                  <UserOutlined style={{ color: ['#1890ff', '#52c41a', '#fa8c16'][index % 3], marginRight: 8 }} />
                  {buyerTotal.buyerName}
                </div>
                <div className="ctt-buyer-total-value">
                  {Number(buyerTotal.total).toLocaleString('vi-VN')} VNĐ
                </div>
              </Card>
            ))}
          </div>
          <div className="ctt-personal-expense-row">
            <Card className="ctt-personal-expense-card">
              <div className="ctt-personal-title"><UserOutlined style={{ color: '#1890ff', marginRight: 8 }} />Vương</div>
              <div className="ctt-personal-value">{personalExpenses.vuong.toLocaleString('vi-VN')} VNĐ</div>
            </Card>
            <Card className="ctt-personal-expense-card">
              <div className="ctt-personal-title"><UserOutlined style={{ color: '#52c41a', marginRight: 8 }} />Quân</div>
              <div className="ctt-personal-value">{personalExpenses.quan.toLocaleString('vi-VN')} VNĐ</div>
            </Card>
            <Card className="ctt-personal-expense-card">
              <div className="ctt-personal-title"><UserOutlined style={{ color: '#fa8c16', marginRight: 8 }} />Cường</div>
              <div className="ctt-personal-value">{personalExpenses.cuong.toLocaleString('vi-VN')} VNĐ</div>
            </Card>
          </div>
          
        </div>
      </div>

      <Modal
        title={isClearAll ? "Nhập PIN để xóa tất cả" : "Nhập PIN để xóa mục này"}
        open={isPinModalVisible}
        onOk={handlePinSubmit}
        onCancel={handlePinCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Input.Password
          placeholder="Nhập PIN"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          onPressEnter={handlePinSubmit}
        />
      </Modal>

      <Modal
        title="Lịch sử thanh toán"
        open={isHistoryModalVisible}
        onCancel={closeHistoryModal}
        footer={null}
        width={900}
      >
        <Spin spinning={loadingHistory}>
          <div className="ctt-history-modal-table">
            <Table
              dataSource={historyData}
              rowKey="id"
              pagination={false}
              columns={[
                { title: 'Từ ngày', dataIndex: 'tuNgay', key: 'tuNgay', render: d => dayjs(d).format('DD/MM/YYYY') },
                { title: 'Đến ngày', dataIndex: 'denNgay', key: 'denNgay', render: d => dayjs(d).format('DD/MM/YYYY') },
                { title: 'Tổng chi tiêu', dataIndex: 'tongChiTieu', key: 'tongChiTieu', render: v => v.toLocaleString('vi-VN') + ' VNĐ' },
                { title: 'Vương', dataIndex: 'tongVuong', key: 'tongVuong', render: v => v.toLocaleString('vi-VN') + ' VNĐ' },
                { title: 'Quân', dataIndex: 'tongQuan', key: 'tongQuan', render: v => v.toLocaleString('vi-VN') + ' VNĐ' },
                { title: 'Cường', dataIndex: 'tongCuong', key: 'tongCuong', render: v => v.toLocaleString('vi-VN') + ' VNĐ' },
                { title: 'Ngày tạo', dataIndex: 'ngayTao', key: 'ngayTao', render: d => d ? dayjs(d).format('DD/MM/YYYY HH:mm') : '' },
                {
                  title: 'Xóa',
                  key: 'delete',
                  render: (_, record) => (
                    <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteHistory(record.id)}>
                      Xóa
                    </Button>
                  )
                }
              ]}
              onRow={record => ({
                onClick: () => openDetailModal(record)
              })}
            />
          </div>
        </Spin>
      </Modal>

      <Modal
        title="Nhập PIN để xóa lịch sử thanh toán"
        open={isHistoryDeleteModalVisible}
        onOk={handleHistoryDeleteConfirm}
        onCancel={handleHistoryDeleteCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Input.Password
          placeholder="Nhập PIN"
          value={historyDeletePin}
          onChange={e => setHistoryDeletePin(e.target.value)}
          onPressEnter={handleHistoryDeleteConfirm}
        />
      </Modal>

      <Modal
        title="Chi tiết các khoản chi trong khoảng thời gian"
        open={isDetailModalVisible}
        onCancel={closeDetailModal}
        footer={null}
        width={800}
      >
        <Typography.Text>
          Khoảng: {detailRange.from ? dayjs(detailRange.from).format('DD/MM/YYYY') : ''} - {detailRange.to ? dayjs(detailRange.to).format('DD/MM/YYYY') : ''}
        </Typography.Text>
        <div className="ctt-history-modal-table">
          <Table
            dataSource={detailData}
            rowKey="id"
            pagination={false}
            columns={[
              { title: 'Ngày', dataIndex: 'ngay', key: 'ngay', render: d => dayjs(d).format('DD/MM/YYYY') },
              { title: 'Người mua', dataIndex: 'nguoiMua', key: 'nguoiMua', render: (buyerId) => {
                const user = users.find(u => String(u.id) === String(buyerId));
                return user ? user.fullname : buyerId;
              } },
              { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa' },
              { title: 'Giá tiền', dataIndex: 'giaTien', key: 'giaTien', render: v => Number(v).toLocaleString('vi-VN') + ' VNĐ' },
              { title: 'Vương', dataIndex: 'vuong', key: 'vuong', render: v => v ? '✔️' : '' },
              { title: 'Quân', dataIndex: 'quan', key: 'quan', render: v => v ? '✔️' : '' },
              { title: 'Cường', dataIndex: 'cuong', key: 'cuong', render: v => v ? '✔️' : '' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ChiTieu;
