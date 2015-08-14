package com.jelly.jt8.bo.service.impl;

import com.jelly.jt8.bo.dao.HolidayDao;
import com.jelly.jt8.bo.dao.HolidayExceptionDao;
import com.jelly.jt8.bo.model.Holiday;
import com.jelly.jt8.bo.model.HolidayException;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.service.HolidayExceptionService;
import com.jelly.jt8.bo.util.SqlTool;
import com.jelly.jt8.common.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.List;

/**
 * Created by user on 2015/8/12.
 */
@Service("holidayExceptionService")
public class HolidayExceptionServiceImpl implements HolidayExceptionService {
    @Autowired
    @Qualifier("HolidayDao")
    private HolidayDao holidayDao;

    @Autowired
    @Qualifier("HolidayExceptionDao")
    private HolidayExceptionDao holidayExceptionDao;

    @Autowired
    @Qualifier("jt8Ds")
    private DataSource jt8Ds;

    @Override
    public List<Holiday> selectHoliday(MainSymbol mainSymbol) throws Exception {
//        List<Holiday> list = new ArrayList<Holiday>();
//        Holiday holiday = new Holiday();
//        holiday.setExchange_id(mainSymbol.getExchange_id());
//        holiday.setMain_symbol_id(mainSymbol.getMain_symbol_id());
//        holiday.setBegin_date("20150814");
//        holiday.setEnd_date("20150814");
//        holiday.setMemo("ABC");
//        list.add(holiday);
//        return list;
        return holidayDao.select(mainSymbol);
    }

    @Override
    public void insertHoliday(List<Holiday> holidayList) throws Exception {
        StringBuffer sb = new StringBuffer();
        SqlTool.appendStart(sb);
        for (Holiday holiday : holidayList) {
            SqlTool.append(sb,
                    null,
                    holiday.getExchange_id(),
                    holiday.getMain_symbol_id(),
                    holiday.getBegin_date(),
                    holiday.getEnd_date(),
                    Utils.updateTime(),
                    holiday.getMemo(),
                    null
            );
        }
        SqlTool.appendEnd(sb);
        System.out.println(sb.toString());
        holidayDao.insert(sb.toString());
    }

    @Override
    public void updateHoliday(Holiday holiday) throws Exception {
        StringBuffer sb = new StringBuffer();
        SqlTool.appendStart(sb);
        SqlTool.append(sb,
                String.valueOf(holiday.getHoliday_id()),
                holiday.getExchange_id(),
                holiday.getMain_symbol_id(),
                holiday.getBegin_date(),
                holiday.getEnd_date(),
                Utils.updateTime(),
                holiday.getMemo(),
                String.valueOf(holiday.getRv())
        );
        SqlTool.appendEnd(sb);
        System.out.println(sb.toString());
        holidayDao.update(sb.toString());
    }

    @Override
    public void deleteHoliday(Holiday holiday) throws Exception {
        holidayDao.delete(holiday.getHoliday_id());
    }

    @Override
    public List<HolidayException> selectHolidayException(MainSymbol mainSymbol) throws Exception {
//        List<HolidayException> list = new ArrayList<HolidayException>();
//        HolidayException holidayException = new HolidayException();
//        holidayException.setExchange_id(mainSymbol.getExchange_id());
//        holidayException.setMain_symbol_id(mainSymbol.getMain_symbol_id());
//        holidayException.setCalendar("20150814");
//        holidayException.setMemo("ABC");
//        list.add(holidayException);
//        return list;
        return holidayExceptionDao.select(mainSymbol);
    }

    @Override
    public void insertHolidayException(List<HolidayException> holidayExceptionList) throws Exception {
        StringBuffer sb = new StringBuffer();
        SqlTool.appendStart(sb);
        for (HolidayException holidayException : holidayExceptionList) {
            SqlTool.append(sb, holidayException.getExchange_id(), holidayException.getMain_symbol_id(), holidayException.getCalendar(),  holidayException.getMemo());
        }
        SqlTool.appendEnd(sb);
        System.out.println(sb.toString());
        holidayExceptionDao.insert(sb.toString());
    }

    @Override
    public void updateHolidayException(HolidayException holidayException) throws Exception {
        StringBuffer sb = new StringBuffer();
        SqlTool.appendStart(sb);
        SqlTool.append(sb, String.valueOf(holidayException.getHoliday_id()), holidayException.getExchange_id(), holidayException.getMain_symbol_id(), holidayException.getCalendar(), holidayException.getMemo());
        SqlTool.appendEnd(sb);
        System.out.println(sb.toString());
        holidayExceptionDao.update(sb.toString());
    }

    @Override
    public void deleteHolidayException(HolidayException holidayException) throws Exception {
        holidayExceptionDao.delete(holidayException.getHoliday_id());
    }
}
