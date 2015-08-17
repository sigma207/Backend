package com.jelly.jt8.bo.controller;

import com.google.gson.Gson;
import com.jelly.jt8.bo.model.Holiday;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.model.SymbolTradableDaily;
import com.jelly.jt8.bo.service.SymbolTradableDailyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by user on 2015/8/17.
 */
@Controller
@RequestMapping("/symbolTradableDailyTemp")
public class SymbolTradableDailyTempController extends BaseController {
    @Autowired
    @Qualifier("symbolTradableDailyService")
    private SymbolTradableDailyService service;

    @RequestMapping(method = RequestMethod.GET)
    public
    @ResponseBody
    ResponseEntity<String> getList() {
        System.out.println("getTempList");
        Gson gson = new Gson();
        List<SymbolTradableDaily> list = null;
        String payload = "";
        try {
            list = service.selectSymbolTradableDailyTemp();
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

    @RequestMapping(value = "/exchange/{exchange_id}/mainSymbol/{main_symbol_id}", method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity<String> getListByMainSymbol(@PathVariable("exchange_id") String exchange_id, @PathVariable("main_symbol_id") String main_symbol_id) {
        System.out.println("getListByMainSymbol");
        Gson gson = new Gson();
        List<SymbolTradableDaily> list = null;
        String payload = "";
        try {
            MainSymbol mainSymbol = new MainSymbol();
            mainSymbol.setExchange_id(exchange_id);
            mainSymbol.setMain_symbol_id(main_symbol_id);
            list = service.selectSymbolTradableDailyTemp(mainSymbol);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }

}
