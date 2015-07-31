package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.UserRoleDao;
import com.jelly.jt8.bo.model.RolePermission;
import com.jelly.jt8.bo.model.User;
import com.jelly.jt8.bo.model.UserRole;
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
@Repository("UserRoleDao")
public class UserRoleDaoImpl implements UserRoleDao {
    private final static String QUERY = "SELECT login_id, role_id from User_Role ";
    private final static String WHERE_ROLE = "where login_id = ? ";
    private final static String INSERT = "INSERT INTO User_Role (login_id, role_id) VALUES (?, ?);";
    private final static String DELETE = "DELETE User_Role where login_id = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<UserRole> selectUserRole(User user) throws Exception {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        List<UserRole> list = new LinkedList<UserRole>();
        UserRole obj = null;
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY + WHERE_ROLE);
            stmt.setString(1, user.getLogin_id());
            rs = stmt.executeQuery();
            while (rs.next()) {
                obj = new UserRole(
                        rs.getString("login_id"),
                        rs.getInt("role_id")
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
    public void insertUserRole(Connection connection, UserRole userRole) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(INSERT);
            stmt.setString(1, userRole.getLogin_id());
            stmt.setInt(2, userRole.getRole_id());
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
    public void deleteUserRole(Connection connection, User user) throws Exception {
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
}
