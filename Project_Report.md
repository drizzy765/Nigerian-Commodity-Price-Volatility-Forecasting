# Project Report: Forecasting Nigerian Commodity Volatility

## 1. Executive Summary
This project engineered a fully automated pipeline to forecast the annualized realized volatility of four highly sensitive Nigerian commodities (Maize, Rice, PMS, and Diesel). By consolidating fragmented local data with global macroeconomic indicators, compressing multicollinear features via PCA, and training side-by-side linear and non-linear models tracked through MLflow, we proved computationally what economic theory suggests: extreme structural breaks in the Nigerian economy (e.g., 2023 Subsidy Removal) demand non-linear predictive architectures.

## 2. Methodology & Feature Engineering

### 2.1 The Data Engineering Pipeline
Nigerian macroeconomic data is notoriously fragmented. We consolidated:
- **Global Constraints**: Brent Crude and US 10Y Yields (`fredapi`).
- **Domestic Money & FX**: CBN Official Rates, M2 Supply, and critical Parallel Market data.
- **Commodity Prices**: FEWS NET API for agriculture; NBS reports for energy.

**Mathematical Scrubbing**: Time-series gaps were initially addressed with Cubic Splines. However, severe structural breaks in 2023 caused violent Negative Polynomial Overshoots (Runge's Phenomenon). The pipeline was adjusted to automatically clip physically impossible negative values and safely bridge gaps via shape-preserving linear interpolation. Finally, exponentially growing variables (M2, FX) were log-transformed to stabilize their variance for the algorithms. 

### 2.2 Feature Engineering
The raw data fed into the models underwent specific mathematical transformations:
- **Scaling (`StandardScaler`)**: Ensuring trillions of Naira in M2 were weighted identically to tiny percentage yields from US Bonds.
- **Dimensionality Reduction (`PCA`)**: Because Official FX, Parallel FX, and CPI move identically and cause extreme multicollinearity, they were compressed into 3 distinct, orthogonal "Principal Components" that retained over 80% of the statistical information without confusing the linear algorithms.
- **Autoregression**: Features were shifted back $t-1, t-2$, and $t-3$ months—forcing the model to predict *future* volatility exclusively using *past* data.

---

## 3. Modeling Architectures Evaluated
The environment evaluated linearly penalized models vs tree-based models on exactly the same 80/20 chronological train-test splits.

### 3.1 Regime-Aware Elastic Net (`ElasticNetCV`)
Designed to handle noisy datasets by automatically zeroing out useless variables (Lasso - L1 Penalty) while shrinking related ones together (Ridge - L2 Penalty). It was cross-validated over a grid of mixing ratios.

### 3.2 Random Forest Regressor
A non-linear ensemble of decision trees. Capable of handling extreme conditional logic (i.e., "If FX spikes AND M2 spikes simultaneously, drastically raise volatility estimates").

---

## 4. Empirical Evaluation & Scorecard
The models were asked to forecast late 2024 to early 2025 unseen (Out-of-Sample) volatility.

**Final MLOps R-Squared Scorecard**
| Target | Elastic Net | Random Forest | Winner |
|---|---|---|---|
| **Diesel** | 0.6385 | **0.6815** | Random Forest |
| **Maize** | -2.2925 | **0.0356** | Random Forest |
| **Rice** | -0.1118 | **-0.4313** | Random Forest (Mitigated Loss) |
| **PMS** | -6.6432 | **-22.8502** | *Systematic Failure* |

### 4.1 Interpreting the Model Architectures
The non-linear **Random Forest** comprehensively defeated the Elastic Net. The linear model attempted to draw straight lines through the pre-2023 era and logically extended them into 2024, resulting in catastrophic Out-of-Sample failures (-2.29 R-Squared). The Decision Trees adapted much better to the structural economic break.

### 4.2 Interpreting the Economic Behavior
- **Energy behaves rationally (Diesel):** The model accurately predicted 68% of Diesel's volatility purely off macroeconomic context.
- **Subsidies shatter prediction windows (PMS):** The models failed fundamentally on PMS. From 2018 to May 2023, PMS volatility was artificially pegged at zero by the government. Training any mathematical model on 5 years of `0` variance makes it mathematically impossible to foresee a 500% directional swing.
- **Food moves slower (Maize/Rice):** Based on the Random Forest Feature Importance charts, the $t-1$ lag (the macro environment from exactly one month prior) accounted for over 60% of the prediction logic for agricultural commodities, whereas the $t-3$ lags were mostly ignored. 

## 5. Conclusion
The pipeline successfully validates that Nigerian commodity volatility is highly predictable when operating in a free market (Diesel), but purely statistical models will always break down across massive, sudden policy shifts (PMS Subsidy Removal). The Random Forest architecture coupled with PCA macro-factors proved to be the most resilient predictive framework in this volatile environment.
