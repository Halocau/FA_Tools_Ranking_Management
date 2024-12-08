package backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}

//        long startTime = System.nanoTime(); // Bắt đầu đo thời gian
//        long endTime = System.nanoTime(); // Kết thúc đo thời gian
//        long duration = endTime - startTime;
//        System.out.println("Thời gian chạy: " + duration / 1_000_000 + " ms");