import {
  FaUsers,
  FaBoxOpen,
  FaMoneyBillWave,
  FaPlusCircle,
  FaUserShield,
} from "react-icons/fa";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/UIElements/Button";
import CardContent from "../../shared/components/UIElements/CardContent";
import styles from "./AdminHomePage.module.css";

export default function AdminHomePage() {
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
              <p className={styles.cardValue}>1,245</p>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.card}>
          <CardContent className={styles.cardContent}>
            <FaBoxOpen className="text-purple-600 text-3xl" />
            <div>
              <p className={styles.cardTitle}>Products</p>
              <p className={styles.cardValue}>157</p>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.card}>
          <CardContent className={styles.cardContent}>
            <FaMoneyBillWave className="text-green-600 text-3xl" />
            <div>
              <p className={styles.cardTitle}>Revenue</p>
              <p className={styles.cardValue}>₹1.5M</p>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.card}>
          <CardContent className={styles.cardContent}>
            <FaUserShield className="text-red-600 text-3xl" />
            <div>
              <p className={styles.cardTitle}>Admins</p>
              <p className={styles.cardValue}>3</p>
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
            onClick={() => (window.location.href = "/add")}
          >
            <FaPlusCircle />
            Add Product
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => (window.location.href = "/users")}
          >
            <FaUsers />
            View Users
          </Button>
        </div>
      </div>
    </div>
  );
}
