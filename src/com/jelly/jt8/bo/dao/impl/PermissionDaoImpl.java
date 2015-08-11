package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.PermissionDao;
import com.jelly.jt8.bo.model.Permission;
import com.jelly.jt8.bo.util.RsMapper;
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
    private final static String QUERY = "SELECT permission_id, permission_code, parent_permission_id, sequence, path FROM permission ORDER BY parent_permission_id,sequence";
    private final static String WHERE_PARENT = "WHERE parent_permission_id = ? ";
    private final static String INSERT = "INSERT INTO permission (permission_code, parent_permission_id, sequence, path) VALUES (?, ?, ?, ?);";
    private final static String DELETE = "DELETE permission WHERE permission_id = ? ";
    private final static String UPDATE = "UPDATE permission SET permission_code = ?,sequence = ?, path = ? WHERE permission_id = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<Permission> selectPermission() throws Exception {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        List<Permission> list =  new LinkedList<Permission>();
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY);
            rs = stmt.executeQuery();
            RsMapper.map(rs, list, Permission.class);
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
    public List<Permission> selectPermissionByParent(Permission parentPermission) throws Exception {

        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        List<Permission> list = new LinkedList<Permission>();
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY + WHERE_PARENT);
            if(parentPermission==null){
                stmt.setNull(1,Types.INTEGER);
            }else{
                stmt.setInt(1, parentPermission.getPermission_id());
            }

            rs = stmt.executeQuery();
            RsMapper.map(rs, list, Permission.class);
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
    public int insertPermission(Connection connection,Permission permission) throws Exception {
        PreparedStatement stmt = null;
        int lastKey = -1;
        try {
            stmt = connection.prepareStatement(INSERT,Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, permission.getPermission_code());
            if(permission.getParent_permission_id()==0){
                stmt.setNull(2, Types.INTEGER);
            }else{
                stmt.setInt(2, permission.getParent_permission_id());
            }

            stmt.setInt(3,permission.getSequence());
            stmt.setString(4,permission.getPath());
            stmt.executeUpdate();
            ResultSet keys = stmt.getGeneratedKeys();

            if (keys.next()) {
                lastKey = keys.getInt(1);
            }
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
        return lastKey;
    }

    @Override
    public void deletePermission(Connection connection, Permission permission) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(DELETE);

            stmt.setInt(1, permission.getPermission_id());
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
    public void updatePermission(Connection connection, Permission permission) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(UPDATE);

            stmt.setString(1, permission.getPermission_code());
            stmt.setInt(2,permission.getSequence());
            stmt.setString(3, permission.getPath());
            stmt.setInt(4, permission.getPermission_id());

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
