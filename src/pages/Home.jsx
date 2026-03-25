import { useState, useEffect } from "react";
import ScholarshipCard from "../components/ScholarshipCard";

function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({ opportunities: 0, applications: 0, funded: 0 });

  const scholarships = [
    { id: 1, title: "Merit Scholarship", amount: 50000, deadline: "31 March 2026", category: "merit", description: "Excellence in academics" },
    { id: 2, title: "Need-Based Aid", amount: 30000, deadline: "15 April 2026", category: "need", description: "Financial assistance for students" },
    { id: 3, title: "AI & Tech Grant", amount: 75000, deadline: "10 May 2026", category: "tech", description: "For technology & computing students" },
    { id: 4, title: "Women in STEM", amount: 45000, deadline: "20 April 2026", category: "women", description: "Empowering women in science & tech" },
    { id: 5, title: "International Student Award", amount: 60000, deadline: "25 May 2026", category: "international", description: "For international scholars" },
    { id: 6, title: "Sports Excellence Award", amount: 35000, deadline: "30 March 2026", category: "sports", description: "Recognition of athletic achievement" },
  ];

  // Real-time statistics animation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        opportunities: Math.floor(Math.random() * 500) + 200,
        applications: Math.floor(Math.random() * 1000) + 500,
        funded: Math.floor(Math.random() * 50) + 25
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredScholarships = scholarships.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Your Dream Scholarship Awaits</h1>
          <p style={styles.heroSubtitle}>
            Discover, apply, and track scholarships & financial aid opportunities in one place
          </p>
          
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search scholarships by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button style={styles.searchBtn} aria-label="Search">
              <img src="/search-icon.png" alt="Search" style={{width: "18px", height: "18px", display: "block"}} />
            </button>
          </div>
        </div>
      </section>

      {/* Real-time Statistics */}
      <section style={styles.statsSection}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{stats.opportunities}+</h3>
          <p style={styles.statLabel}>Active Opportunities</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{stats.applications}+</h3>
          <p style={styles.statLabel}>Applications Submitted</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{stats.funded}K+</h3>
          <p style={styles.statLabel}>Students Funded</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={styles.benefitsSection}>
        <h2 style={styles.sectionTitle}>Why Choose Our Platform?</h2>
        <div style={styles.benefitsGrid}>
          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>🎯</div>
            <h3>Smart Matching</h3>
            <p>Find scholarships tailored to your profile</p>
          </div>
          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>⏰</div>
            <h3>Deadline Tracking</h3>
            <p>Never miss an application deadline again</p>
          </div>
          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>📊</div>
            <h3>Progress Tracking</h3>
            <p>Monitor your applications in real-time</p>
          </div>
          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>💰</div>
            <h3>Maximum Savings</h3>
            <p>Access diverse funding opportunities</p>
          </div>
        </div>
      </section>

      {/* Scholarships Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Scholarships</h2>
        
        {/* Filter Buttons */}
        <div style={styles.filterContainer}>
          {["all", "merit", "need", "tech", "women", "sports"].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              style={{
                ...styles.filterBtn,
                ...(filter === category ? styles.filterBtnActive : {})
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Scholarship Cards */}
        <div style={styles.cardContainer}>
          {filteredScholarships.length > 0 ? (
            filteredScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                title={scholarship.title}
                amount={scholarship.amount}
                deadline={scholarship.deadline}
              />
            ))
          ) : (
            <p style={styles.noResults}>No scholarships found. Try a different search!</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2>Ready to Start Your Scholarship Journey?</h2>
        <p>Join thousands of students who have successfully secured their funding</p>
        <button style={styles.ctaBtn}>Explore More Scholarships →</button>
      </section>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#fff",
  },
  hero: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "100px 20px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden"
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
    animation: "slideDown 0.8s ease-out"
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "15px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
  },
  heroSubtitle: {
    fontSize: "20px",
    marginBottom: "40px",
    opacity: 0.95
  },
  searchContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    maxWidth: "500px",
    margin: "0 auto",
    position: "relative"
  },
  searchInput: {
    flex: 1,
    padding: "15px 20px",
    paddingRight: "52px",
    fontSize: "16px",
    border: "none",
    borderRadius: "50px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    outline: "none"
  },
  searchBtn: {
    padding: "0",
    background: "transparent",
    color: "#ffffff",
    border: "none",
    borderRadius: "0",
    cursor: "pointer",
    fontSize: "20px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "none",
    transition: "color 0.15s ease, transform 0.08s ease",
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)"
  },
  statsSection: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    padding: "60px 20px",
    background: "#f8f9fa",
    flexWrap: "wrap"
  },
  statCard: {
    background: "white",
    padding: "30px 40px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    minWidth: "200px",
    transition: "transform 0.3s ease"
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#667eea",
    margin: "0 0 10px 0"
  },
  statLabel: {
    fontSize: "16px",
    color: "#666",
    margin: 0
  },
  benefitsSection: {
    padding: "80px 20px",
    background: "white"
  },
  benefitsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  benefitCard: {
    background: "#f8f9fa",
    padding: "40px",
    borderRadius: "15px",
    textAlign: "center",
    transition: "transform 0.3s ease, boxShadow 0.3s ease",
    ":hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 15px 40px rgba(102, 126, 234, 0.2)"
    }
  },
  benefitIcon: {
    fontSize: "48px",
    marginBottom: "20px"
  },
  section: {
    padding: "60px 20px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  sectionTitle: {
    fontSize: "36px",
    textAlign: "center",
    marginBottom: "40px",
    color: "#333",
    fontWeight: "700"
  },
  filterContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "40px",
    flexWrap: "wrap"
  },
  filterBtn: {
    padding: "10px 20px",
    border: "2px solid #ddd",
    background: "white",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    color: "#666"
  },
  filterBtnActive: {
    background: "#667eea",
    color: "white",
    border: "2px solid #667eea"
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "25px",
    marginTop: "30px"
  },
  noResults: {
    textAlign: "center",
    fontSize: "18px",
    color: "#999",
    padding: "40px"
  },
  ctaSection: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "80px 20px",
    textAlign: "center"
  },
  ctaBtn: {
    marginTop: "20px",
    padding: "15px 40px",
    fontSize: "16px",
    fontWeight: "600",
    background: "white",
    color: "#667eea",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "transform 0.3s ease, boxShadow 0.3s ease",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
  }
};

export default Home;
