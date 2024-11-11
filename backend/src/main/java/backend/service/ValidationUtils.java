package backend.service;

import backend.model.validation.Group;

import java.util.List;

public class ValidationUtils {

    /**
     * Hàm validate tên khi cập nhật cho bất kỳ đối tượng nào.
     *
     * @param id        ID của đối tượng cần cập nhật
     * @param oldName   Tên cũ của đối tượng
     * @param newName   Tên mới cần kiểm tra
     * @param objects   Danh sách các đối tượng cần kiểm tra trùng tên
     * @param <T>       Loại đối tượng cần kiểm tra (phải có phương thức getName và getId)
     * @return true nếu tên hợp lệ, false nếu có trùng tên.
     */
    public static <T> boolean validateNameForUpdate(int id, String oldName, String newName, List<T> objects) {
        // Nếu tên mới không thay đổi, không cần kiểm tra gì cả
        if (oldName.equals(newName)) {
            return true;
        }

        // Kiểm tra trùng tên với danh sách các đối tượng
        for (T object : objects) {
            String existingName = getName(object); // Lấy tên của đối tượng hiện tại
            int existingId = getId(object); // Lấy ID của đối tượng hiện tại

            // Kiểm tra trùng tên và không phải là đối tượng đang được cập nhật
            if (existingId != id && existingName.equals(newName)) {
                return false; // Trùng tên
            }
        }

        return true; // Tên hợp lệ
    }

    // Lấy tên của đối tượng (cần được định nghĩa trong các lớp đối tượng)
    private static <T> String getName(T object) {
        // Giả sử đối tượng có phương thức getName, tùy vào loại đối tượng mà bạn cần implement cách lấy tên
        if (object instanceof Group) {
            return ((Group) object).getName();
        }
        // Các loại đối tượng khác có thể thêm ở đây...
        throw new IllegalArgumentException("Unsupported object type");
    }

    // Lấy ID của đối tượng (cần được định nghĩa trong các lớp đối tượng)
    private static <T> int getId(T object) {
        // Giả sử đối tượng có phương thức getId, tùy vào loại đối tượng mà bạn cần implement cách lấy id
        if (object instanceof Group) {
            return ((Group) object).getId();
        }
        // Các loại đối tượng khác có thể thêm ở đây...
        throw new IllegalArgumentException("Unsupported object type");
    }
}
