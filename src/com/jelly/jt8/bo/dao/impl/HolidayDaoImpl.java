package com.jelly.jt8.bo.dao.impl;

import com.jelly.jt8.bo.dao.HolidayDao;
import com.jelly.jt8.bo.model.Holiday;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.model.Permission;
import com.jelly.jt8.bo.util.ErrorMsg;
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
    private final static String INSERT = "INSERT INTO symbol_holiday (exchange_id, main_symbol_id, begin_date, end_date,update_time, memo) VALUES (?, ?, ?, ?, ?, ?);";
    private final static String DELETE = "DELETE symbol_holiday WHERE holiday_id = ? AND rv = ? ";
    private final static String UPDATE = "UPDATE symbol_holiday SET begin_date = ?,end_date = ?, update_time = ?, memo = ? WHERE holiday_id = ? AND rv = ? ";

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
    public void insert(Connection conn, List<Holiday> holidayList) throws Exception {
        PreparedStatement stmt = null;
        try {
            int count = 0;
            stmt = conn.prepareStatement(INSERT);
            for (Holiday holiday : holidayList) {
                stmt.setString(1, holiday.getExchange_id());
                stmt.setString(2, holiday.getMain_symbol_id());
                stmt.setString(3, holiday.getBegin_date());
                stmt.setString(4, holiday.getEnd_date());
                stmt.setString(5, Utils.updateTime());
                stmt.setString(6, holiday.getMemo());
                stmt.addBatch();
                if(++count % batchSize == 0) {
                    stmt.executeBatch();
                }
            }
            stmt.executeBatch();
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
    public void update(Connection conn, Holiday holiday) throws Exception {
        PreparedStatement stmt = null;
        try {
            stmt = conn.prepareStatement(UPDATE);

            stmt.setString(1, holiday.getBegin_date());
            stmt.setString(2, holiday.getEnd_date());
            stmt.setString(3, Utils.updateTime());
            stmt.setString(4, holiday.getMemo());
            stmt.setInt(5, holiday.getHoliday_id());
            stmt.setBytes(6, holiday.getRv());
            int updateCount =stmt.executeUpdate();
            if(updateCount==0){
                throw new Exception(ErrorMsg.DIRTY_DATA);
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
    }

    @Override
    public void delete(Connection conn, Holiday holiday) throws Exception {
        PreparedStatement stmt = null;
        int updateCount = 0;
        try {
            stmt = conn.prepareStatement(DELETE);

            stmt.setInt(1, holiday.getHoliday_id());
            stmt.setBytes(2, holiday.getRv());
            updateCount =stmt.executeUpdate();
            if(updateCount==0){
                throw new Exception(ErrorMsg.DIRTY_DATA);
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
    }
}
