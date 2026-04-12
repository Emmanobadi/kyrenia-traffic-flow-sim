"""Generate PDF reference document with TRNC traffic data for validation."""

from fpdf import FPDF
from datetime import datetime


class TrafficDataPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 14)
        self.cell(0, 10, "TRNC Traffic Data - Reference & Validation", align="C")
        self.ln(5)
        self.set_font("Helvetica", "I", 9)
        self.cell(0, 5, f"Generated: {datetime.now().strftime('%Y-%m-%d')}", align="C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def section_title(self, title):
        self.set_font("Helvetica", "B", 12)
        self.set_fill_color(230, 230, 250)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT", fill=True)
        self.ln(2)

    def bullet(self, text, indent=5):
        self.set_font("Helvetica", "", 10)
        self.cell(indent)
        self.cell(5, 5, "-")
        self.multi_cell(185, 5, text)

    def table(self, headers, rows, col_widths=None):
        self.set_font("Helvetica", "B", 9)
        if col_widths is None:
            col_widths = [190 / len(headers)] * len(headers)

        # Header
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 7, h, border=1, fill=True, align="C")
        self.ln()

        # Rows
        self.set_font("Helvetica", "", 9)
        for row in rows:
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 6, str(cell), border=1, align="C")
            self.ln()


def generate_pdf():
    pdf = TrafficDataPDF()
    pdf.set_auto_page_break(auto=True, margin=15)

    # ============================================================
    # PAGE 1: KYRENIA TRAFFIC STATISTICS
    # ============================================================
    pdf.add_page()

    pdf.section_title("1. Kyrenia (Girne) Traffic Statistics (Numbeo 2024)")

    pdf.set_font("Helvetica", "I", 9)
    pdf.cell(0, 5, "Source: numbeo.com/traffic | 33 contributors | Last updated: Jan 2024")
    pdf.ln(8)

    # Traffic Indices Table
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "Traffic Indices")
    pdf.ln(1)

    headers = ["Metric", "Value", "Interpretation"]
    rows = [
        ["Traffic Index", "94.76", "High congestion level"],
        ["Time Expansion Index", "42.05", "42% longer trips due to traffic"],
        ["Inefficiency Index", "42.42", "High inefficiency"],
        ["CO2 Emission Index", "2,926", "Environmental impact"],
    ]
    pdf.table(headers, rows, col_widths=[60, 40, 90])
    pdf.ln(5)

    # Commute Metrics Table
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "Commute & Travel Metrics")
    pdf.ln(1)

    headers = ["Metric", "Value"]
    rows = [
        ["Average Travel Time", "27.67 minutes"],
        ["Average Distance", "11.33 km"],
        ["Car Commute Distance", "25.00 km"],
        ["Car Commute Time (driving)", "20.00 min"],
        ["Car Commute Time (total)", "25.00 min"],
        ["Walking Distance", "4.50 km"],
        ["Walking Time", "22.50 min"],
        ["Walking Total Time", "29.00 min"],
    ]
    pdf.table(headers, rows, col_widths=[80, 50])
    pdf.ln(5)

    # Transportation Mode
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "Transportation Mode Distribution")
    pdf.ln(1)

    headers = ["Mode", "Percentage"]
    rows = [
        ["Walking", "66.67%"],
        ["Car", "33.33%"],
    ]
    pdf.table(headers, rows, col_widths=[80, 50])
    pdf.ln(8)

    # Validation Targets
    pdf.section_title("Validation Targets (Kyrenia)")
    pdf.bullet("Traffic Index target: ~95")
    pdf.bullet("Congestion level: ~40% during peak hours")
    pdf.bullet("Average trip time expansion: ~42%")
    pdf.bullet("Mode split: ~33% car, ~67% walking/other")

    # ============================================================
    # PAGE 2: NICOSIA & NATIONAL DATA
    # ============================================================
    pdf.add_page()

    pdf.section_title("2. Nicosia Congestion Data (2024)")
    pdf.set_font("Helvetica", "I", 9)
    pdf.cell(0, 5, "Source: Kathimerini Cyprus / TomTom Traffic Index")
    pdf.ln(8)

    headers = ["Metric", "Value"]
    rows = [
        ["Congestion Level", "41%"],
        ["Time Lost in Peak Traffic", "99 hours/year"],
        ["Global Ranking", "Among world's slowest cities"],
    ]
    pdf.table(headers, rows, col_widths=[90, 50])
    pdf.ln(8)

    pdf.section_title("3. Cyprus National Traffic Data (EU/TomTom)")
    pdf.set_font("Helvetica", "I", 9)
    pdf.cell(0, 5, "Source: TomTom Traffic Index / EU Road Safety Report")
    pdf.ln(8)

    headers = ["Metric", "Value"]
    rows = [
        ["Average Congestion Level", "46.1%"],
        ["Average Speed", "28.9 km/h"],
        ["Avg Distance (15 min)", "7.2 km"],
        ["Highway Trip Ratio", "7%"],
    ]
    pdf.table(headers, rows, col_widths=[90, 50])
    pdf.ln(8)

    # ============================================================
    # PAGE 3: TRNC SURVEYS & DATA SOURCES
    # ============================================================
    pdf.section_title("4. TRNC Traffic Flow Survey (Nov 2024)")
    pdf.set_font("Helvetica", "I", 9)
    pdf.cell(0, 5, "Source: Full Cyprus / TRNC Ministry of Interior")
    pdf.ln(8)

    pdf.bullet("Comprehensive traffic flow survey conducted across TRNC")
    pdf.bullet("Sensors installed on highways to count vehicles")
    pdf.bullet("Data forwarded to Department of Roads")
    pdf.bullet("Part of General Road Plan initiative")
    pdf.ln(3)
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "Status: Full results NOT publicly available yet", ln=True)
    pdf.ln(5)

    pdf.section_title("5. Available Academic Data Sources")

    pdf.bullet('"Statistical Anatomy of Traffic Accidents in Northern Cyprus" - ResearchGate')
    pdf.bullet('METU study: "Traffic Accident Analysis Using GIS - Kyrenia City" (2011-2019)')
    pdf.bullet("EU Road Safety Country Profile - Cyprus (2024)")
    pdf.bullet("Trendline 2022-2025: Road Safety Data Collection (EU)")
    pdf.ln(5)

    pdf.section_title("6. Data Gaps & Limitations")

    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(180, 0, 0)
    pdf.cell(0, 6, "NOT Available:", ln=True)
    pdf.set_text_color(0, 0, 0)

    pdf.bullet("Actual vehicle counts per road segment")
    pdf.bullet("Hourly traffic volume data")
    pdf.bullet("Lane-specific flow rates")
    pdf.bullet("Real-time traffic data")
    pdf.bullet("Peak hour factor data")
    pdf.bullet("Road capacity measurements")
    pdf.ln(5)

    pdf.set_font("Helvetica", "I", 10)
    pdf.set_text_color(0, 100, 0)
    pdf.multi_cell(0, 5, "Recommendation: Use available data as validation targets and calibration parameters. Collect primary data if possible for accurate simulation.")
    pdf.set_text_color(0, 0, 0)

    # ============================================================
    # PAGE 4: SIMULATION CALIBRATION PARAMETERS
    # ============================================================
    pdf.add_page()

    pdf.section_title("7. Simulation Calibration Parameters (Derived)")

    pdf.set_font("Helvetica", "I", 9)
    pdf.cell(0, 5, "These values should be used to calibrate the simulation model")
    pdf.ln(8)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "A. Traffic Volume Parameters")
    pdf.ln(1)

    headers = ["Parameter", "Target Value", "Notes"]
    rows = [
        ["Peak hour congestion", "40-46%", "Match Nicosia/Cyprus avg"],
        ["Average speed (urban)", "28-30 km/h", "From TomTom data"],
        ["Trip time expansion", "42%", "Congestion delay factor"],
        ["Highway usage", "7%", "Trip ratio"],
    ]
    pdf.table(headers, rows, col_widths=[60, 40, 80])
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "B. Driver Behavior Parameters")
    pdf.ln(1)

    headers = ["Parameter", "Suggested Range", "Notes"]
    rows = [
        ["Max speed (urban)", "50-60 km/h", "Urban roads"],
        ["Max speed (highway)", "80-100 km/h", "Highways"],
        ["Time gap", "1.0-2.0 s", "IDM parameter"],
        ["Max acceleration", "0.5-1.5 m/s2", "Typical urban"],
        ["Comfortable deceleration", "1.5-2.5 m/s2", "IDM parameter"],
    ]
    pdf.table(headers, rows, col_widths=[60, 50, 70])
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "C. Validation Checkpoints")
    pdf.ln(1)

    pdf.bullet("Simulated Traffic Index should approach ~95 for Kyrenia")
    pdf.bullet("Average simulated speed should be ~29 km/h in urban areas")
    pdf.bullet("Congestion levels should reach ~40% during peak scenarios")
    pdf.bullet("Trip times should be ~42% longer than free-flow conditions")
    pdf.bullet("Accident probability should correlate with density and speed variance")

    # Save
    output_path = r"c:\Users\ahmed\kyrenia-traffic-flow-sim\analysis\TRNC_Traffic_Data_Reference.pdf"
    pdf.output(output_path)
    print(f"PDF saved: {output_path}")


if __name__ == "__main__":
    generate_pdf()
