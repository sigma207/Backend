package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.HolidayDao;
import com.jelly.jt8.bo.model.Holiday;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.model.Permission;
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
 * Created by user on 2015/8/12.
 */
@Repository("HolidayDao")
public class HolidayDaoImpl extends BaseDao implements HolidayDao{
    private final static String QUERY = "SELECT holiday_id, exchange_id, main_symbol_id, begin_date, end_date, update_time, memo, rv FROM symbol_holiday ";
    private final static String WHERE_MAIN_SYMBOL = "WHERE exchange_id = ? AND main_symbol_id = ? ";

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<Holiday> select(MainSymbol mainSymbol) throws Exception {
        List<Holiday> list =  new LinkedList<Holiday>();
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Connection conn = null;

        try {
            conn = jt8Ds.getConnection();
            stmt = conn.prepareStatement(QUERY + WHERE_MAIN_SYMBOL);
            stmt.setString(1,mainSymbol.getExchange_id());
            stmt.setString(2, mainSymbol.getMain_symbol_id());

            rs = stmt.executeQuery();
            RsMapper.map(rs, list, Holiday.class);
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
    public void insert(Connection conn, Holiday holiday) throws Exception {
        PreparedStatement stmt = null;
        int lastKey = -1;
        try {

            stmt = connection.prepareStatement(INSERT, Statement.RETURN_GENERATED_KEYS);
            stmt.setNull(1, Types.INTEGER);
            stmt.setString(2, role.getRole_code());
            stmt.setString(3, role.getRole_name());
            stmt.setString(4, Utils.updateTime());
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
        CallableStatement cs = null;
        Connection conn = null;

        try {
            conn = jt8Ds.getConnection();
            cs = conn.prepareCall("{call symbol_holiday_add(?,?,?,?)}");

            cs.setString(1, holidayList);
            cs.setString(2, "''");
            cs.registerOutParameter(3, Types.INTEGER);
            cs.registerOutParameter(4, Types.VARCHAR);

            cs.execute();
            parseError(cs.getInt(3), cs.getString(4));
        } catch (Exception e) {
            throw e;
        } finally {
            try {
                if (cs != null) {
                    cs.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }


    @Override
    public void update(Connection conn, Holiday holiday) throws Exception {
        CallableStatement cs = null;
        Connection conn = null;

        try {
            conn = jt8Ds.getConnection();
            cs = conn.prepareCall("{call symbol_holiday_update(?,?,?,?)}");

            cs.setString(1, holiday);
            cs.setString(2, "''");
            cs.registerOutParameter(3, Types.INTEGER);
            cs.registerOutParameter(4, Types.VARCHAR);

            cs.execute();
            parseError(cs.getInt(3), cs.getString(4));
        } catch (Exception e) {
            throw e;
        } finally {
            try {
                if (cs != null) {
                    cs.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void delete(Connection conn, Holiday holiday) throws Exception {
        CallableStatement cs = null;
        Connection conn = null;

        try {
            conn = jt8Ds.getConnection();
            cs = conn.prepareCall("{call symbol_holiday_delete(?,?,?,?)}");

            cs.setInt(1, holiday_id);
            cs.setInt(2, 0);
            cs.registerOutParameter(3, Types.INTEGER);
            cs.registerOutParameter(4, Types.VARCHAR);

            cs.execute();
            parseError(cs.getInt(3), cs.getString(4));
        } catch (Exception e) {
            throw e;
        } finally {
            try {
                if (cs != null) {
                    cs.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
