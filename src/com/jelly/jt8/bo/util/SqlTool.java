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

    public void connect(DataSource dataSource, String sql)throws SQLException{
        this.dataSource = dataSource;
        this.sql = sql;
        try {
            conn = dataSource.getConnection();
            preparedStatement = conn.prepareStatement(sql);
        } catch (Exception e){
            e.printStackTrace();
            if (preparedStatement != null) {
                preparedStatement.close();
            }
            if (conn != null) {
                conn.close();
            }
            if(e instanceof SQLException){
                throw e;
            }
        }
    }

    public ResultSet query() throws SQLException{
        try {
            rs = preparedStatement.executeQuery();
        }catch (SQLException se) {
            throw se;
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
