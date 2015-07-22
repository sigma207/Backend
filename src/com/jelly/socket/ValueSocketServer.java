package com.jelly.socket;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * Created by user on 2015/7/1.
 */
public class ValueSocketServer {
    private static ServerSocket server;
    private static int port = 9876;
    public static void main(String[] args) throws IOException,ClassNotFoundException{
        server = new ServerSocket(port);
        while (true){
            System.out.println("Waiting client client request");

            Socket socket = server.accept();
            System.out.println("server.accept()");

            ObjectInputStream ois = new ObjectInputStream(socket.getInputStream());

            String message = (String)ois.readObject();
            System.out.println("Message received:" + message);
            ObjectOutputStream oos = new ObjectOutputStream(socket.getOutputStream());
            int newValue = (int)(Math.random()*10);
            oos.writeObject(String.valueOf(newValue));

            ois.close();
            oos.close();
            socket.close();
            if(message.equalsIgnoreCase("exit"))break;
        }
        System.out.println("shutting down Socket server");
        server.close();
    }
}
