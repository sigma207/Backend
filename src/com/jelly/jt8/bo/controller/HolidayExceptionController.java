package com.jelly.jt8.bo.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.jelly.jt8.bo.model.Holiday;
import com.jelly.jt8.bo.model.HolidayException;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.model.Role;
import com.jelly.jt8.bo.service.HolidayExceptionService;
import com.jelly.jt8.bo.service.RoleService;
import com.jelly.jt8.bo.util.JsParse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by user on 2015/8/12.
 */
@Controller

public class HolidayExceptionController extends BaseController {
    @Autowired
    @Qualifier("holidayExceptionService")
    private HolidayExceptionService service;

    @RequestMapping(value = "holiday/select", method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> getHolidayList(@RequestBody MainSymbol mainSymbol) {
        System.out.println("getHolidayList");
        Gson gson = new Gson();
        List<Holiday> list = null;
        String payload = "";
        try {
            list = service.selectHoliday(mainSymbol);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "holiday/insert", method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> addHolidayList(@RequestBody List<Holiday> list) {
        System.out.println("addHolidayList");
        Gson gson = new Gson();
        String payload = "";
        try {
            for(Holiday holiday:list){
//                holiday.setBegin_date(JsParse.jsDateToDate(holiday.getBegin_date()));
//                holiday.setEnd_date(JsParse.jsDateToDate(holiday.getEnd_date()));
            }
            service.insertHoliday(list);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }
        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "holiday/update", method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> updateHoliday(@RequestBody Holiday holiday) {
        Gson gson = new Gson();
        String payload = "";
        try {
//            holiday.setBegin_date(JsParse.jsDateToDate(holiday.getBegin_date()));
//            holiday.setEnd_date(JsParse.jsDateToDate(holiday.getEnd_date()));
            service.updateHoliday(holiday);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }
        payload = gson.toJson(holiday);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "holiday/delete", method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> deleteHoliday(@RequestBody Holiday holiday) {
        Gson gson = new Gson();
        String payload = "";
        try {
            service.deleteHoliday(holiday);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }
        payload = gson.toJson(holiday);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "holidayException/select", method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> getHolidayExceptionList(@RequestBody MainSymbol mainSymbol) {
        System.out.println("getHolidayExceptionList");
        Gson gson = new Gson();
        List<HolidayException> list = null;
        String payload = "";
        try {
            list = service.selectHolidayException(mainSymbol);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "holidayException/insert", method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> addHolidayExceptionList(@RequestBody List<HolidayException> list) {
        System.out.println("addHolidayList");
        Gson gson = new Gson();
        String payload = "";
        try {
//            for(HolidayException holidayException:list){
//                holidayException.setCalendar(JsParse.jsDateToDate(holidayException.getCalendar()));
//            }
            service.insertHolidayException(list);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }
        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "holidayException/update", method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> updateHolidayException(@RequestBody HolidayException holidayException) {
        Gson gson = new Gson();
        String payload = "";
        try {
//            holidayException.setCalendar(JsParse.jsDateToDate(holidayException.getCalendar()));
            service.updateHolidayException(holidayException);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }
        payload = gson.toJson(holidayException);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "holidayException/delete", method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> deleteHolidayException(@RequestBody HolidayException holidayException) {
        Gson gson = new Gson();
        String payload = "";
        try {
            service.deleteHolidayException(holidayException);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }
        payload = gson.toJson(holidayException);
        return getResponseEntity(payload);
    }
}
