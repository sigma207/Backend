package com.jelly.jt8.bo.util;

import com.jelly.jt8.bo.model.Permission;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by user on 2015/7/24.
 */
public class SqlTool {
    private DataSource dataSource;
    private String sql;
    private PreparedStatement preparedStatement = null;
    private ResultSet rs = null;
    private Connection conn = null;

    public void connect(Connection conn, String sql)throws Exception{
        try {
            preparedStatement = conn.prepareStatement(sql);
        } catch (Exception e){
            if (preparedStatement != null) {
                preparedStatement.close();
            }
            if (conn != null) {
                conn.close();
            }
        }
    }

    public ResultSet executeQuery() throws Exception{
        try {
            rs = preparedStatement.executeQuery();
        } catch (Exception e){
            e.printStackTrace();
        } finally {
            try {
                this.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return rs;
    }

    public void close() throws SQLException{
        if (rs != null) {
            rs.close();
        }
        if (preparedStatement != null) {
            preparedStatement.close();
        }
        if (conn != null) {
            conn.close();
        }
    }

    public PreparedStatement getPreparedStatement() {
        return preparedStatement;
    }
}
