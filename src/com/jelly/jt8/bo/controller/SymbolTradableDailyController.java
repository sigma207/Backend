package com.jelly.jt8.bo.controller;

import com.google.gson.Gson;
import com.jelly.jt8.bo.model.MainSymbol;
import com.jelly.jt8.bo.model.SymbolTradableDaily;
import com.jelly.jt8.bo.service.SymbolTradableDailyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by user on 2015/8/19.
 */
@Controller
@RequestMapping("/symbolTradableDaily")
public class SymbolTradableDailyController extends BaseController {
    @Autowired
    @Qualifier("symbolTradableDailyService")
    private SymbolTradableDailyService service;

    @RequestMapping(value = "/exchange/{exchange_id}/mainSymbol/{main_symbol_id}", method = RequestMethod.GET)
    public
    @ResponseBody
    ResponseEntity<String> getList(@PathVariable("exchange_id") String exchange_id, @PathVariable("main_symbol_id") String main_symbol_id) {
        Gson gson = new Gson();
        List<SymbolTradableDaily> list = null;
        String payload = "";
        try {
            MainSymbol mainSymbol = new MainSymbol();
            mainSymbol.setExchange_id(exchange_id);
            mainSymbol.setMain_symbol_id(main_symbol_id);
            list = service.selectSymbolTradableDaily(mainSymbol);
        } catch (Exception e) {
            return new ResponseEntity<String>(gson.toJson(exceptionToJson(e)), HttpStatus.SERVICE_UNAVAILABLE);
        }

        payload = gson.toJson(list);
        return getResponseEntity(payload);
    }
}
