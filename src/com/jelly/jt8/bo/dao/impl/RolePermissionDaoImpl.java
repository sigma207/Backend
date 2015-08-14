package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.RolePermissionDao;
import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.model.RolePermission;
import com.jelly.jt8.bo.util.RsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by user on 2015/7/28.
 */
@Repository("RolePermissionDao")
public class RolePermissionDaoImpl extends BaseDao implements RolePermissionDao {
    private final static String QUERY = "SELECT role_id, permission_id FROM bo_role_permission ";
    private final static String WHERE_ROLE = "WHERE role_id = ? ";
    private final static String INSERT = "INSERT INTO bo_role_permission (role_id, permission_id) VALUES (?, ?);";
    private final static String DELETE = "DELETE bo_role_permission WHERE role_id = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<RolePermission> selectRolePermissionByRole(Role role) throws Exception {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        List<RolePermission> list = new LinkedList<RolePermission>();
        RolePermission obj = null;
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY + WHERE_ROLE);
            stmt.setInt(1, role.getRole_id());
            rs = stmt.executeQuery();
            RsMapper.map(rs, list, RolePermission.class);
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
    public void insertRolePermission(Connection connection, RolePermission rolePermission) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(INSERT);
            stmt.setInt(1, rolePermission.getRole_id());
            stmt.setInt(2, rolePermission.getPermission_id());
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
    public void deleteRolePermissionByRole(Connection connection, Role role) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(DELETE);

            stmt.setInt(1, role.getRole_id());
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
