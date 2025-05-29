import { useNavigate } from "react-router-dom";
import { FaUsers, FaBoxOpen, FaPlusCircle } from "react-icons/fa";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/UIElements/Button";
import CardContent from "../../shared/components/UIElements/CardContent";
import styles from "./AdminHomePage.module.css";
import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/users/stats");
        const data = await res.json();
        setUserCount(data.totalUsers);
        setProductCount(data.totalProducts);
        // You can also use data.totalAdmins if needed later
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      {/* Stats Section */}
      <div className={styles.statsGrid}>
        <Card className={styles.card}>
          <CardContent className={styles.cardContent}>
            <FaUsers className="text-blue-600 text-3xl" />
            <div>
              <p className={styles.cardTitle}>Total Users</p>
              <p className={styles.cardValue}>{userCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.card}>
          <CardContent className={styles.cardContent}>
            <FaBoxOpen className="text-purple-600 text-3xl" />
            <div>
              <p className={styles.cardTitle}>Products</p>
              <p className={styles.cardValue}>{productCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className={styles.actionsContainer}>
        <h2 className={styles.actionsTitle}>Quick Actions</h2>
        <div className={styles.actionsButtons}>
          <Button
            className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/add")}
          >
            <FaPlusCircle />
            Add Product
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/user-list")}
          >
            <FaUsers />
            View Users
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/userpurchasehistory")}
          >
            <FaUsers />
            View User Purchase History
          </Button>
        </div>
      </div>
    </div>
  );
}
