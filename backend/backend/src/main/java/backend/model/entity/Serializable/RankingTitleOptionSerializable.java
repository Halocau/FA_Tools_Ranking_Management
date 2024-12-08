package backend.model.entity.Serializable;

import java.util.Objects;

public class RankingTitleOptionSerializable {
    private Integer rankingTitleId;  // Updated to match camelCase style
    private Integer optionId;        // Updated to match camelCase style

    public RankingTitleOptionSerializable() {
    }

    public RankingTitleOptionSerializable(Integer rankingTitleId, Integer optionId) {
        this.rankingTitleId = rankingTitleId;
        this.optionId = optionId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RankingTitleOptionSerializable that = (RankingTitleOptionSerializable) o;
        return Objects.equals(rankingTitleId, that.rankingTitleId) && Objects.equals(optionId, that.optionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rankingTitleId, optionId);
    }

    // Getters and setters
}
