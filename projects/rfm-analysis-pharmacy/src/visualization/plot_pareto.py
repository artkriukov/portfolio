import matplotlib.pyplot as plt

def plot_pareto(
    df,
    customer_pct_col,
    revenue_pct_col,
    title="Кривая Парето клиентской базы (ABC-анализ)"
):
    # точки разделения ABC-классов
    a_point = df.loc[
        df[revenue_pct_col] >= 80,
        customer_pct_col
    ].iloc[0]

    b_point = df.loc[
        df[revenue_pct_col] >= 95,
        customer_pct_col
    ].iloc[0]


    fig, ax = plt.subplots(figsize=(10, 5))


    # кривая Парето
    ax.plot(
        df[customer_pct_col],
        df[revenue_pct_col],
        linewidth=2.5
    )


    # горизонтальные линии 80% и 95% выручки
    ax.axhline(
        80,
        linestyle="--"
    )

    ax.axhline(
        95,
        linestyle="--"
    )


    # вертикальные границы ABC
    ax.axvline(
        a_point,
        linestyle="--"
    )

    ax.axvline(
        b_point,
        linestyle="--"
    )


    # подписи классов
    ax.text(
        a_point,
        5,
        f"A: {a_point:.1f}% клиентов",
        rotation=90,
        verticalalignment="bottom"
    )

    ax.text(
        b_point,
        5,
        f"B: {b_point:.1f}% клиентов",
        rotation=90,
        verticalalignment="bottom"
    )


    ax.set_xlabel(
        "Доля клиентов (%)"
    )

    ax.set_ylabel(
        "Накопленная доля выручки (%)"
    )


    ax.set_title(
        title,
        pad=15
    )


    ax.grid(
        linestyle="--",
        alpha=0.4
    )

    plt.tight_layout()
    plt.show()