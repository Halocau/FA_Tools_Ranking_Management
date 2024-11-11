package backend.config.common;

import backend.config.exception.exceptionEntity.PageException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public class PaginationUtils {
    /**
     * Chuyển đổi từ tham số page và size thành Pageable.
     *
     * @param page Tham số trang từ yêu cầu của người dùng (bắt đầu từ 1)
     * @param size Kích thước trang từ yêu cầu của người dùng
     * @return Pageable đối tượng để phân trang
     */
    public static Pageable createPageable(Optional<String> page, Optional<String> size) {
        try {
            String pageRaw = page.isPresent() ? page.get() : "";
            String sizeRaw = size.isPresent() ? size.get() : "";
            int pageCurrent = parsePage(pageRaw);
            int pageSize = parseSize(sizeRaw);

            return PageRequest.of(pageCurrent - 1, pageSize);
        } catch (Exception e) {
            throw new PageException("Page and size must be valid numbers.");
        }
    }

    // Helper method to parse page
    private static int parsePage(String pageRaw) {
        try {
            int page = Integer.parseInt(pageRaw);
            if (page <= 0) {
                return 1; // Default to page 1 if invalid
            }
            return page;
        } catch (NumberFormatException e) {
            return 1; // Default to page 1 if invalid
        }
    }

    // Helper method to parse size
    private static int parseSize(String sizeRaw) {
        try {
            int size = Integer.parseInt(sizeRaw);
            if (size <= 0) {
                return 5; // Default to size 10 if invalid
            }
            return size;
        } catch (NumberFormatException e) {
            return 5; // Default to size 10 if invalid
        }
    }
}
