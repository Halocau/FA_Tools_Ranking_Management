package backend.model.entity.Serializable;

import java.util.Objects;

public class RankingTitleOptionSerializable {
    private Integer RankingTitleId;
    private Integer OptionId;

    public RankingTitleOptionSerializable() {
    }

    public RankingTitleOptionSerializable(Integer rankingTitleId, Integer optionId) {
        RankingTitleId = rankingTitleId;
        OptionId = optionId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RankingTitleOptionSerializable that = (RankingTitleOptionSerializable) o;
        return Objects.equals(RankingTitleId, that.RankingTitleId) && Objects.equals(OptionId, that.OptionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(RankingTitleId, OptionId);
    }
}
