package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.UserDao;
import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.model.User;
import com.jelly.jt8.bo.util.ErrorMsg;
import com.jelly.jt8.bo.util.Password;
import com.jelly.jt8.common.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.*;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by user on 2015/7/30.
 */
@Repository("UserDao")
public class UserDaoImpl implements UserDao {
    private final static String QUERY = "SELECT login_id, password, create_time, permission, concurrent, retry, max_retry, active_date, duration, expire_date, update_time," +
            " is_active, login_time, last_login_time, org_id FROM bo_user ";
    private final static String INSERT = "INSERT INTO bo_user (login_id, password, create_time, permission, concurrent, retry, max_retry, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
    private final static String UPDATE = "UPDATE bo_user SET update_time = ? WHERE login_id = ? ";
    private final static String DELETE = "DELETE bo_user WHERE login_id = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<User> selectUser() throws Exception {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        List<User> list = new LinkedList<User>();
        User obj = null;
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY);
            rs = stmt.executeQuery();
            while (rs.next()) {
                obj = new User(
                        rs.getString("login_id"),
                        null,
                        rs.getString("create_time"),
                        rs.getInt("permission"),
                        rs.getInt("concurrent"),
                        rs.getInt("retry"),
                        rs.getInt("max_retry"),
                        rs.getString("active_date"),
                        rs.getInt("duration"),
                        rs.getString("expire_date"),
                        rs.getString("update_time"),
                        rs.getInt("is_active"),
                        rs.getString("login_time"),
                        rs.getString("last_login_time"),
                        rs.getString("org_id")
                        );
                list.add(obj);
            }
        } catch (Exception e){
            throw e;
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (stmt != null) {
                    stmt.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return list;
    }

    @Override
    public void insertUser(Connection connection, User user) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(INSERT);
            stmt.setString(1, user.getLogin_id());
            stmt.setString(2, user.getPassword());
            stmt.setString(3,  Utils.updateTime());//create_time
            stmt.setInt(4, 1);//permission
            stmt.setInt(5, 1);//concurrent
            stmt.setInt(6, 0);//retry
            stmt.setInt(7, 5);//max_retry
            stmt.setString(8, Utils.updateTime());//update_time
            stmt.executeUpdate();

        } catch (Exception e){
            throw e;
        } finally {
            try {
                if (stmt != null) {
                    stmt.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void deleteUser(Connection connection, User user) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(DELETE);

            stmt.setString(1, user.getLogin_id());
            stmt.executeUpdate();
        } catch (Exception e){
            throw e;
        } finally {
            try {
                if (stmt != null) {
                    stmt.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void updateUser(Connection connection, User user) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(UPDATE);

            stmt.setString(1, Utils.updateTime());
            stmt.setString(2, user.getLogin_id());
        } catch (Exception e){
            throw e;
        } finally {
            try {
                if (stmt != null) {
                    stmt.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
