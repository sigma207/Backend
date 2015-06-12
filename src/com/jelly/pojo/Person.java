package com.jelly.pojo;

/**
 * Created by user on 2015/6/12.
 */
public class Person {
    private Axe axe;
    private int id;
    private String name;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Axe getAxe() {
        return axe;
    }

    public void setAxe(Axe axe) {
        this.axe = axe;
    }

    public void useAxe(){
        System.out.println(name+axe.chop());
    }
}
