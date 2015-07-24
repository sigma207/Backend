package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.PermissionDao;
import com.jelly.jt8.bo.model.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by user on 2015/7/24.
 */
@Repository("PermissionDao")
public class PermissionDaoImpl implements PermissionDao {
    private final static String QUERY = "SELECT permission_id, permission_code, parent_permission_id, sequence from Permission ";
    private final static String WHERE_PARENT = "where parent_permission_id = ? ";
    private final static String INSERT = "INSERT INTO Permission A(permission_code, parent_permission_id, sequence) VALUES (?, ?, ?);";
    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<Permission> selectPermission() throws SQLException {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        List<Permission> list = new LinkedList<Permission>();
        Permission obj = null;
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY);
            rs = stmt.executeQuery();
            while (rs.next()) {
                obj = new Permission(
                        rs.getInt("permission_id"),
                        rs.getString("permission_code"),
                        rs.getInt("parent_permission_id"),
                        rs.getInt("sequence")
                );
                list.add(obj);
            }
        }catch (SQLException se) {
            throw se;
        } catch (Exception e){
            e.printStackTrace();
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
    public List<Permission> selectPermissionByParent(Permission parentPermission) throws SQLException {

        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        List<Permission> list = new LinkedList<Permission>();
        Permission obj = null;
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY + WHERE_PARENT);
            if(parentPermission==null){
                stmt.setNull(1,Types.INTEGER);
            }else{
                stmt.setInt(1, parentPermission.getPermission_id());
            }

            rs = stmt.executeQuery();
            while (rs.next()) {
                obj = new Permission(
                        rs.getInt("permission_id"),
                        rs.getString("permission_code"),
                        rs.getInt("parent_permission_id"),
                        rs.getInt("sequence")
                );
                list.add(obj);
            }
        }catch (SQLException se) {
            throw se;
        } catch (Exception e){
            e.printStackTrace();
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
    public int insertPermission(Permission permission) throws SQLException {
        PreparedStatement stmt = null;
        Connection conn = null;
        int lastKey = -1;
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(INSERT,Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1,permission.getPermission_code());
            stmt.setInt(2, permission.getParent_permission_id());
            stmt.setInt(3,permission.getSequence());
            stmt.executeUpdate();
            ResultSet keys = stmt.getGeneratedKeys();

            if (keys.next()) {
                lastKey = keys.getInt(1);
            }
        } catch (SQLException se) {
            throw se;
        } catch (Exception e){
            e.printStackTrace();
        } finally {
            try {
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
        return lastKey;
    }
}
