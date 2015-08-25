package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.UserDao;
import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.model.User;
import com.jelly.jt8.bo.util.ErrorMsg;
import com.jelly.jt8.bo.util.Password;
import com.jelly.jt8.bo.util.RsMapper;
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
public class UserDaoImpl extends BaseDao implements UserDao {
    private final static String QUERY = "SELECT user_id, login_id, password, create_time, permission, concurrent, retry, max_retry, active_date, duration, expire_date, update_time," +
            " is_active, login_time, last_login_time, org_id, organization_id, parent_user_id FROM bo_user ";
    private final static String INSERT = "INSERT INTO bo_user (login_id, password, create_time, permission, concurrent, retry, max_retry, update_time, organization_id, parent_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    private final static String UPDATE = "UPDATE bo_user SET update_time = ? WHERE user_id = ? ";
    private final static String DELETE = "DELETE bo_user WHERE user_id = ? ";
    private final static String WHERE_LOGIN = "WHERE login_id = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public User login(String login_id) throws Exception {
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        List<User> list = new LinkedList<User>();
        User user = null;
        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY + WHERE_LOGIN);
            stmt.setString(1,login_id);

            rs = stmt.executeQuery();
            RsMapper.map(rs, list, User.class);
            if(list.size()>0){
                user = list.get(0);
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
        return user;
    }

    @Override
    public List<User> selectUser() throws Exception {
        List<User> list = new LinkedList<User>();
        execute(jt8Ds.getConnection(),QUERY,list,User.class);//要改成可以不要set password
        return list;
    }

    @Override
    public void insertUser(Connection connection, User user) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(INSERT);
            stmt.setString(1, user.getLogin_id());
            stmt.setString(2, user.getPassword());
            stmt.setString(3, Utils.updateTime());//create_time
            stmt.setInt(4, 1);//permission
            stmt.setInt(5, 1);//concurrent
            stmt.setInt(6, 0);//retry
            stmt.setInt(7, 5);//max_retry
            stmt.setString(8, Utils.updateTime());//update_time
            if(user.getOrganization()!=null){
                stmt.setInt(9,user.getOrganization().getOrganization_id());
            }else{
                stmt.setNull(9, Types.INTEGER);
            }
            if(user.getParent_user()!=null){
                stmt.setInt(10, user.getParent_user().getUser_id());
            }else{
                stmt.setNull(10, Types.INTEGER);
            }

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

    @Override
    public void updateUser(Connection connection, User user) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = connection.prepareStatement(UPDATE);

            stmt.setString(1, Utils.updateTime());
            stmt.setInt(2, user.getUser_id());
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
