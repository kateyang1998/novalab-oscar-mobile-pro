import { useNavigate } from 'react-router-dom';
import TopHeader from '../components/layout/TopHeader';
import theme from '../styles/theme';

const mockContacts = [
  { id: 1, name: 'OSCAR Support', role: 'Technical Support', phone: '+1 (555) 210-0123', email: 'support@oscar.example.com', hours: 'Mon–Fri 08:00–18:00' },
  { id: 2, name: 'Clinical Help Desk', role: 'Clinical Coordinator', phone: '+1 (555) 210-0456', email: 'clinichelp@oscar.example.com', hours: 'Mon–Fri 09:00–17:00' },
  { id: 3, name: 'Account Manager', role: 'Customer Success', phone: '+1 (555) 210-0789', email: 'accounts@oscar.example.com', hours: 'Mon–Fri 08:30–16:30' },
];

const HelpScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <TopHeader title="Help & Support" onBack={() => navigate(-1)} />
      <div style={styles.content}>
        <p style={styles.intro}>If you need assistance, contact one of the teams below. Tap a contact to call or email.</p>

        <div style={styles.list}>
          {mockContacts.map(c => (
            <div key={c.id} style={styles.card}>
              <div style={styles.avatar}>{c.name.split(' ').map(n => n[0]).slice(0,2).join('')}</div>
              <div style={styles.cardBody}>
                <div style={styles.cardTitleRow}>
                  <div style={styles.cardTitle}>{c.name}</div>
                  <div style={styles.cardRole}>{c.role}</div>
                </div>
                <div style={styles.cardMeta}>
                  <div style={styles.metaLine}><strong>Phone:</strong> <a href={`tel:${c.phone.replace(/[^+\d]/g,'')}`} style={styles.link}>{c.phone}</a></div>
                  <div style={styles.metaLine}><strong>Email:</strong> <a href={`mailto:${c.email}`} style={styles.link}>{c.email}</a></div>
                  <div style={styles.metaLine}><strong>Hours:</strong> <span>{c.hours}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', background: theme.colors.oscarGray },
  content: { padding: 16, overflowY: 'auto', flex: 1 },
  intro: { margin: '8px 0 16px', color: theme.colors.paleSky },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { display: 'flex', gap: 12, background: 'var(--color-surface)', padding: 12, borderRadius: 10, alignItems: 'flex-start' },
  avatar: { width: 48, height: 48, borderRadius: 24, background: theme.colors.oscarBlue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 },
  cardBody: { flex: 1, display: 'flex', flexDirection: 'column' },
  cardTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
  cardTitle: { fontSize: 16, fontWeight: 700, color: 'var(--color-text)' },
  cardRole: { fontSize: 13, color: theme.colors.paleSky },
  cardMeta: { marginTop: 8, color: theme.colors.paleSky, fontSize: 13 },
  metaLine: { marginBottom: 6 },
  link: { color: theme.colors.oscarBlue, textDecoration: 'none' },
};

export default HelpScreen;

