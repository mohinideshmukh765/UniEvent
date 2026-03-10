import java.sql.*;

public class JdbcTest {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://localhost:5432/eventportal";
        String user = "postgres";
        String password = "student";
        
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            try (Statement stmt = conn.createStatement()) {
                int count = stmt.executeUpdate("UPDATE event SET college_code = (SELECT college_code FROM colleges LIMIT 1) WHERE college_code IS NULL");
                System.out.println("Linked " + count + " events with missing college_code to a valid college.");
            } catch (Exception e) { e.printStackTrace(); }
            
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT event_id, title, college_code FROM event")) {
                while(rs.next()) {
                    System.out.println("Event " + rs.getInt(1) + " -> College " + rs.getString(3));
                }
            }
        }
    }
}
