package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.UserRoleDao;
import com.jelly.jt8.bo.model.RolePermission;
import com.jelly.jt8.bo.model.User;
import com.jelly.jt8.bo.model.UserRole;
import com.jelly.jt8.bo.util.RsMapper;
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
public class UserRoleDaoImpl extends BaseDao implements UserRoleDao {
    private final static String QUERY = "SELECT user_id, role_id FROM bo_user_role ";
    private final static String WHERE_ROLE = "WHERE user_id = ? ";
    private final static String INSERT = "INSERT INTO bo_user_role (user_id, role_id) VALUES (?, ?);";
    private final static String DELETE = "DELETE bo_user_role WHERE user_id = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<UserRole> selectUserRole(int user_id) throws Exception {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        List<UserRole> list = new LinkedList<UserRole>();
        UserRole obj = null;
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY + WHERE_ROLE);
            stmt.setInt(1, user_id);
            rs = stmt.executeQuery();
            RsMapper.map(rs, list, UserRole.class);
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
            stmt.setInt(1, userRole.getUser_id());
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

            stmt.setInt(1, user.getUser_id());
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
