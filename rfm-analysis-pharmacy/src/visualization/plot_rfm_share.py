import matplotlib.pyplot as plt

def plot_rfm_share(
    df,
    segment_col,
    customer_share_col,
    revenue_share_col,
    xlabel,
    ylabel,
    ax1label,
    ax2label,
    title
):

    fig, ax1 = plt.subplots()

    bars = ax1.bar(
        df[segment_col],
        df[customer_share_col],
        width=0.6,
        color="tab:blue",
        alpha=0.8,
        label=ax1label
    )

    ax1.set_xlabel(xlabel)
    ax1.set_ylabel(ylabel, color="tab:blue")
    ax1.tick_params(axis="y", labelcolor="tab:blue")

    ax1.bar_label(
        bars,
        fmt="%.1f%%",
        padding=3,
        fontsize=9
    )

    ax1.grid(axis="y", linestyle="--", alpha=0.4)

    ax2 = ax1.twinx()

    ax2.plot(
        df[segment_col],
        df[revenue_share_col],
        color="tab:orange",
        marker="o",
        linewidth=3,
        markersize=7,
        label=ax2label
    )

    ax2.set_ylabel(ax2label, color="tab:orange")
    ax2.tick_params(axis="y", labelcolor="tab:orange")

    for x, y in zip(df[segment_col], df[revenue_share_col]):
        ax2.annotate(
            f"{y:.1f}%",
            xy=(x, y),
            xytext=(0, 8),
            textcoords="offset points",
            ha="center",
            fontsize=9
        )

    handles1, labels1 = ax1.get_legend_handles_labels()
    handles2, labels2 = ax2.get_legend_handles_labels()

    ax1.legend(
        handles1 + handles2,
        labels1 + labels2,
        loc="upper right",
        frameon=False
    )

    ax1.set_title(
        title,
        pad=15
    )

    plt.tight_layout()
    plt.show()