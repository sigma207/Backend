package com.jelly.jt8.bo.model;

/**
 * Created by user on 2015/8/11.
 */
public class Holiday {
    private int holiday_id;
    private String exchange_id;
    private String main_symbol_id;
    private String begin_date;
    private String end_date;
    private String update_time;
    private String memo;
    private byte[] rv;

    public int getHoliday_id() {
        return holiday_id;
    }

    public void setHoliday_id(int holiday_id) {
        this.holiday_id = holiday_id;
    }

    public String getExchange_id() {
        return exchange_id;
    }

    public void setExchange_id(String exchange_id) {
        this.exchange_id = exchange_id;
    }

    public String getMain_symbol_id() {
        return main_symbol_id;
    }

    public void setMain_symbol_id(String main_symbol_id) {
        this.main_symbol_id = main_symbol_id;
    }

    public String getBegin_date() {
        return begin_date;
    }

    public void setBegin_date(String begin_date) {
        this.begin_date = begin_date;
    }

    public String getEnd_date() {
        return end_date;
    }

    public void setEnd_date(String end_date) {
        this.end_date = end_date;
    }

    public String getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(String update_time) {
        this.update_time = update_time;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public byte[] getRv() {
        return rv;
    }

    public void setRv(byte[] rv) {
        this.rv = rv;
    }
}
