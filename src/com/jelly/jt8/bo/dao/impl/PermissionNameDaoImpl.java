package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.PermissionNameDao;
import com.jelly.jt8.bo.model.Holiday;
import com.jelly.jt8.bo.model.PermissionName;
import com.jelly.jt8.bo.util.RsMapper;
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
public class PermissionNameDaoImpl extends BaseDao implements PermissionNameDao {
    private final static String QUERY = "SELECT permission_id, language, name FROM bo_permission_name ";
    private final static String INSERT = "INSERT INTO bo_permission_name (permission_id, language, name) VALUES (?, ?, ?);";
    private final static String DELETE = "DELETE bo_permission_name WHERE permission_id = ? ";
    private final static String UPDATE = "UPDATE bo_permission_name SET name = ? WHERE permission_id = ? AND language = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<PermissionName> selectPermissionName() throws Exception {
        List<PermissionName> list = new LinkedList<PermissionName>();
        execute(jt8Ds.getConnection(),QUERY,list,PermissionName.class);
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
