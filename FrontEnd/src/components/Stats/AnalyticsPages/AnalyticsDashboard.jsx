import React, { useState, useEffect } from 'react';

// Imports 
import { getAnalyticsData } from '../../../Hooks/AuthFirebase';

// Import styles 
import styles from './AnalyticsDashboard.module.css';

// Component 
export const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    totalVisitors: 0,
    pageViews: 0,
    bounceRate: 0,
    topPages: [],
    events: [],
    userDemographics: {}
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de Firebase Analytics
        const analyticsData = await getAnalyticsData(timeRange);
        console.log(analyticsData)
        const eventData = null;
        
        setStats({
          totalVisitors: analyticsData.totalUsers || 0,
          pageViews: analyticsData.pageViews || 0,
          bounceRate: analyticsData.bounceRate || 0,
          topPages: analyticsData.topPages || [],
          events: eventData || [],
          userDemographics: analyticsData.userDemographics || {}
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Analíticas del Sitio</h2>
        <div className={styles.timeRangeSelector}>
          <button 
            className={`${styles.timeButton} ${timeRange === '24h' ? styles.active : ''}`}
            onClick={() => setTimeRange('24h')}
          >
            24h
          </button>
          <button 
            className={`${styles.timeButton} ${timeRange === '7d' ? styles.active : ''}`}
            onClick={() => setTimeRange('7d')}
          >
            7 días
          </button>
          <button 
            className={`${styles.timeButton} ${timeRange === '30d' ? styles.active : ''}`}
            onClick={() => setTimeRange('30d')}
          >
            30 días
          </button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {/* Tarjeta de Visitantes Totales */}
        <div className={`${styles.metricCard} ${styles.primaryCard}`}>
          <div className={styles.metricIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className={styles.metricContent}>
            <h3 className={styles.metricTitle}>Visitantes</h3>
            <p className={styles.metricValue}>{stats.totalVisitors.toLocaleString()}</p>
            <p className={styles.metricChange}>+12% vs período anterior</p>
          </div>
        </div>

        {/* Tarjeta de Vistas de Página */}
        <div className={`${styles.metricCard} ${styles.secondaryCard}`}>
          <div className={styles.metricIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div className={styles.metricContent}>
            <h3 className={styles.metricTitle}>Vistas de página</h3>
            <p className={styles.metricValue}>{stats.pageViews.toLocaleString()}</p>
            <p className={styles.metricChange}>+8% vs período anterior</p>
          </div>
        </div>

        {/* Tarjeta de Tasa de Rebote */}
        <div className={`${styles.metricCard} ${styles.accentCard}`}>
          <div className={styles.metricIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
          </div>
          <div className={styles.metricContent}>
            <h3 className={styles.metricTitle}>Tasa de rebote</h3>
            <p className={styles.metricValue}>{stats.bounceRate}%</p>
            <p className={styles.metricChange}>-2% vs período anterior</p>
          </div>
        </div>

        {/* Tarjeta de Eventos */}
        <div className={`${styles.metricCard} ${styles.successCard}`}>
          <div className={styles.metricIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div className={styles.metricContent}>
            <h3 className={styles.metricTitle}>Eventos</h3>
            <p className={styles.metricValue}>{stats.events.length}</p>
            <p className={styles.metricChange}>Eventos registrados</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        {/* Gráfico de páginas más visitadas */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Páginas más visitadas</h3>
          <div className={styles.barChart}>
            {stats.topPages.slice(0, 5).map((page, index) => (
              <div key={index} className={styles.barItem}>
                <div className={styles.barLabel}>{page.path}</div>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.barFill} 
                    style={{ width: `${(page.views / stats.pageViews) * 100}%` }}
                  ></div>
                  <span className={styles.barValue}>{page.views.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de eventos */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Eventos más comunes</h3>
          <div className={styles.eventList}>
            {stats.events.slice(0, 5).map((event, index) => (
              <div key={index} className={styles.eventItem}>
                <div className={styles.eventName}>{event.name}</div>
                <div className={styles.eventCount}>{event.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demográficos */}
      <div className={styles.demographicsContainer}>
        <h3 className={styles.sectionTitle}>Demográficos</h3>
        <div className={styles.demographicsGrid}>
          <div className={styles.demographicCard}>
            <h4 className={styles.demographicTitle}>Dispositivos</h4>
            <div className={styles.donutChart}>
              {Object.entries(stats.userDemographics.devices || {}).map(([device, percent], index) => (
                <div 
                  key={index} 
                  className={styles.donutSegment}
                  style={{
                    '--percentage': `${percent}%`,
                    '--color': `var(--accent-${400 + (index * 100)})`
                  }}
                >
                  <span className={styles.donutLabel}>{device}: {percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.demographicCard}>
            <h4 className={styles.demographicTitle}>Países</h4>
            <div className={styles.countryList}>
              {Object.entries(stats.userDemographics.countries || {}).slice(0, 5).map(([country, count], index) => (
                <div key={index} className={styles.countryItem}>
                  <span className={styles.countryName}>{country}</span>
                  <span className={styles.countryCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}