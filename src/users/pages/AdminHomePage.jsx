import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBoxOpen,
  FaPlusCircle,
  FaChartLine,
  FaShoppingCart,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaStar,
  FaBell,
  FaCog,
  FaFileExport,
  FaSyncAlt,
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/UIElements/Button";
import CardContent from "../../shared/components/UIElements/CardContent";
import styles from "./AdminHomePage.module.css";
import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [timeRange, setTimeRange] = useState("week");
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Sample data for charts (replace with real API data)
  const weeklySales = [
    { name: "Mon", sales: 4000 },
    { name: "Tue", sales: 3000 },
    { name: "Wed", sales: 5000 },
    { name: "Thu", sales: 2780 },
    { name: "Fri", sales: 6890 },
    { name: "Sat", sales: 8390 },
    { name: "Sun", sales: 7390 },
  ];

  const categoryDistribution = [
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Books", value: 200 },
    { name: "Home", value: 278 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch multiple stats concurrently
        const [statsRes, ordersRes, lowStockRes, revenueRes] =
          await Promise.all([
            fetch("http://localhost:5001/api/users/stats"),
            fetch("http://localhost:5001/api/orders/recent?limit=5"),
            fetch("http://localhost:5001/api/products/low-stock"),
            fetch("http://localhost:5001/api/orders/revenue"),
          ]);

        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        const lowStockData = await lowStockRes.json();
        const revenueData = await revenueRes.json();

        setUserCount(statsData.totalUsers || 0);
        setProductCount(statsData.totalProducts || 0);
        setAdminCount(statsData.totalAdmins || 0);
        setRecentOrders(ordersData.orders || []);
        setLowStockProducts(lowStockData.products || []);
        setRevenue(revenueData.totalRevenue || 0);

        // Simulated notifications (replace with real data)
        setNotifications([
          {
            id: 1,
            message: "New user registered",
            time: "5 min ago",
            type: "info",
          },
          {
            id: 2,
            message: "Order #1234 completed",
            time: "1 hour ago",
            type: "success",
          },
          {
            id: 3,
            message: "Low stock alert: iPhone 13",
            time: "2 hours ago",
            type: "warning",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleExportData = () => {
    // Implement export functionality
    console.log("Exporting data...");
  };

  const handleRefresh = () => {
    setLoading(true);
    // Re-fetch data
    window.location.reload();
  };

  const StatCard = ({ icon: Icon, title, value, color, trend, trendValue }) => (
    <Card className={styles.statCard}>
      <CardContent className={styles.statCardContent}>
        <div
          className={styles.statIconWrapper}
          style={{ backgroundColor: color + "20" }}
        >
          <Icon className={styles.statIcon} style={{ color }} />
        </div>
        <div className={styles.statInfo}>
          <p className={styles.statTitle}>{title}</p>
          <p className={styles.statValue}>{value}</p>
          {trend && (
            <p
              className={`${styles.statTrend} ${trend > 0 ? styles.trendUp : styles.trendDown}`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={styles.container}>
      {/* Header with actions */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome back, Admin! Here's what's happening today.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            className={styles.headerButton}
            onClick={handleRefresh}
          >
            <FaSyncAlt className={loading ? styles.spinning : ""} />
            Refresh
          </Button>
          <Button
            variant="outline"
            className={styles.headerButton}
            onClick={handleExportData}
          >
            <FaFileExport />
            Export
          </Button>
          <Button
            className={styles.settingsButton}
            onClick={() => navigate("/settings")}
          >
            <FaCog />
          </Button>
        </div>
      </div>

      {/* Notifications Bar */}
      {notifications.length > 0 && (
        <div className={styles.notificationsBar}>
          <FaBell className={styles.notificationIcon} />
          <div className={styles.notificationsList}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`${styles.notificationItem} ${styles[notif.type]}`}
              >
                {notif.type === "warning" && <FaExclamationTriangle />}
                {notif.type === "success" && <FaCheckCircle />}
                {notif.type === "info" && <FaBell />}
                <span>{notif.message}</span>
                <small>{notif.time}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={FaUsers}
          title="Total Users"
          value={userCount.toLocaleString()}
          color="#3B82F6"
          trend={12}
        />
        <StatCard
          icon={FaBoxOpen}
          title="Products"
          value={productCount.toLocaleString()}
          color="#8B5CF6"
          trend={8}
        />
        <StatCard
          icon={FaShoppingCart}
          title="Total Orders"
          value="1,234"
          color="#10B981"
          trend={-3}
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="Revenue"
          value={`$${revenue.toLocaleString()}`}
          color="#F59E0B"
          trend={15}
        />
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        <Card className={styles.chartCard}>
          <CardContent>
            <div className={styles.chartHeader}>
              <h3>Sales Overview</h3>
              <select
                className={styles.timeRangeSelect}
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="year">Last 12 months</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={styles.chartCard}>
          <CardContent>
            <div className={styles.chartHeader}>
              <h3>Category Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className={styles.bottomGrid}>
        {/* Quick Actions */}
        <Card className={styles.actionsCard}>
          <CardContent>
            <h2 className={styles.actionsTitle}>Quick Actions</h2>
            <div className={styles.actionsGrid}>
              <button
                className={styles.actionItem}
                onClick={() => navigate("/add")}
              >
                <div
                  className={styles.actionIcon}
                  style={{ backgroundColor: "#3B82F620" }}
                >
                  <FaPlusCircle style={{ color: "#3B82F6" }} />
                </div>
                <span>Add Product</span>
              </button>

              <button
                className={styles.actionItem}
                onClick={() => navigate("/user-list")}
              >
                <div
                  className={styles.actionIcon}
                  style={{ backgroundColor: "#8B5CF620" }}
                >
                  <FaUsers style={{ color: "#8B5CF6" }} />
                </div>
                <span>View Users</span>
              </button>

              <button
                className={styles.actionItem}
                onClick={() => navigate("/userpurchasehistory")}
              >
                <div
                  className={styles.actionIcon}
                  style={{ backgroundColor: "#10B98120" }}
                >
                  <FaShoppingCart style={{ color: "#10B981" }} />
                </div>
                <span>Purchase History</span>
              </button>

              <button
                className={styles.actionItem}
                onClick={() => navigate("/analytics")}
              >
                <div
                  className={styles.actionIcon}
                  style={{ backgroundColor: "#F59E0B20" }}
                >
                  <FaChartLine style={{ color: "#F59E0B" }} />
                </div>
                <span>Analytics</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className={styles.recentOrdersCard}>
          <CardContent>
            <div className={styles.recentOrdersHeader}>
              <h2>Recent Orders</h2>
              <Button variant="ghost" onClick={() => navigate("/orders")}>
                <FaEye /> View All
              </Button>
            </div>
            <div className={styles.ordersList}>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <div key={index} className={styles.orderItem}>
                    <div className={styles.orderInfo}>
                      <span className={styles.orderId}>#{order.id}</span>
                      <span className={styles.orderCustomer}>
                        {order.customer}
                      </span>
                    </div>
                    <div className={styles.orderStatus}>
                      <span
                        className={`${styles.statusBadge} ${styles[order.status]}`}
                      >
                        {order.status}
                      </span>
                      <span className={styles.orderAmount}>
                        ${order.amount}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.noData}>No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Card className={styles.lowStockCard}>
            <CardContent>
              <div className={styles.lowStockHeader}>
                <h2>
                  <FaExclamationTriangle className={styles.warningIcon} />
                  Low Stock Alert
                </h2>
              </div>
              <div className={styles.lowStockList}>
                {lowStockProducts.map((product, index) => (
                  <div key={index} className={styles.lowStockItem}>
                    <span>{product.name}</span>
                    <span className={styles.stockCount}>
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className={styles.manageStockBtn}
                onClick={() => navigate("/products")}
              >
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
