package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.PermissionNameDao;
import com.jelly.jt8.bo.model.PermissionName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by user on 2015/7/27.
 */
@Repository("PermissionNameDao")
public class PermissionNameDaoImpl implements PermissionNameDao {
    private final static String QUERY = "SELECT permission_id, language, name from Permission_Name ";
    private final static String INSERT = "INSERT INTO Permission_Name (permission_id, language, name) VALUES (?, ?, ?);";
    private final static String DELETE = "DELETE Permission_Name where permission_id = ? ";
    private final static String UPDATE = "UPDATE Permission_Name set name = ? where permission_id = ? and language = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<PermissionName> selectPermissionName() throws Exception {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;
        List<PermissionName> list = new LinkedList<PermissionName>();
        PermissionName obj = null;
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY);
            rs = stmt.executeQuery();
            while (rs.next()) {
                obj = new PermissionName(
                        rs.getInt("permission_id"),
                        rs.getString("language"),
                        rs.getString("name")
                );
                list.add(obj);
            }
        } catch (Exception e) {
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
    public void insertPermissionName(Connection connection, PermissionName permissionName) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(INSERT);

            stmt.setInt(1, permissionName.getPermission_id());
            stmt.setString(2, permissionName.getLanguage());
            stmt.setString(3, permissionName.getName());
            stmt.executeUpdate();
        } catch (Exception e) {
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
    public void deletePermissionNameByPermissionId(Connection connection, int permission_id) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(DELETE);

            stmt.setInt(1, permission_id);
            stmt.executeUpdate();
        } catch (Exception e) {
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
    public void updatePermissionNameByPermissionId(Connection connection,  PermissionName permissionName) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(UPDATE);

            stmt.setString(1, permissionName.getName());
            stmt.setInt(2, permissionName.getPermission_id());
            stmt.setString(3, permissionName.getLanguage());
            stmt.executeUpdate();
        } catch (Exception e) {
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
