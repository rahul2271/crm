import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local')

const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, phone: String, isActive: { type: Boolean, default: true } }, { timestamps: true })
const DiseaseSchema = new mongoose.Schema({ name: String, category: String, isActive: { type: Boolean, default: true } })

const User    = mongoose.models.User    || mongoose.model('User', UserSchema)
const Disease = mongoose.models.Disease || mongoose.model('Disease', DiseaseSchema)

const diseases = [
  { name: 'Hypertension',           category: 'Cardiology' },
  { name: 'Coronary Artery Disease',category: 'Cardiology' },
  { name: 'Heart Failure',          category: 'Cardiology' },
  { name: 'Type 2 Diabetes',        category: 'Endocrinology' },
  { name: 'Type 1 Diabetes',        category: 'Endocrinology' },
  { name: 'Hypothyroidism',         category: 'Endocrinology' },
  { name: 'PCOS',                   category: 'Endocrinology' },
  { name: 'Knee Osteoarthritis',    category: 'Orthopedics' },
  { name: 'Slip Disc / Sciatica',   category: 'Orthopedics' },
  { name: 'Cervical Spondylosis',   category: 'Orthopedics' },
  { name: 'Migraine',               category: 'Neurology' },
  { name: 'Epilepsy',               category: 'Neurology' },
  { name: 'Parkinson\'s Disease',   category: 'Neurology' },
  { name: 'GERD / Acid Reflux',     category: 'Gastroenterology' },
  { name: 'Fatty Liver',            category: 'Gastroenterology' },
  { name: 'Irritable Bowel Syndrome', category: 'Gastroenterology' },
  { name: 'Asthma',                 category: 'Pulmonology' },
  { name: 'COPD',                   category: 'Pulmonology' },
  { name: 'Sleep Apnea',            category: 'Pulmonology' },
  { name: 'Psoriasis',              category: 'Dermatology' },
  { name: 'Eczema',                 category: 'Dermatology' },
  { name: 'Vitiligo',               category: 'Dermatology' },
  { name: 'Breast Cancer',          category: 'Oncology' },
  { name: 'Prostate Cancer',        category: 'Oncology' },
  { name: 'Chronic Kidney Disease', category: 'Nephrology' },
  { name: 'Anemia',                 category: 'General Medicine' },
  { name: 'Osteoporosis',           category: 'Endocrinology' },
]

async function seed() {
  console.log('🌱 Connecting…')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected\n')

  // Admin
  if (!await User.findOne({ email: 'admin@patientcrm.com' })) {
    await User.create({ name: 'Super Admin', email: 'admin@patientcrm.com', password: await bcrypt.hash('Admin@1234', 10), role: 'admin', isActive: true })
    console.log('👤 Admin: admin@patientcrm.com / Admin@1234')
  } else console.log('👤 Admin already exists')

  // Telecallers
  for (const tc of [
    { name: 'Priya Sharma', email: 'priya@patientcrm.com', phone: '9876543210' },
    { name: 'Rahul Verma',  email: 'rahul@patientcrm.com', phone: '9876543211' },
    { name: 'Anita Patel',  email: 'anita@patientcrm.com', phone: '9876543212' },
  ]) {
    if (!await User.findOne({ email: tc.email })) {
      await User.create({ ...tc, password: await bcrypt.hash('Telecaller@1234', 10), role: 'telecaller', isActive: true })
      console.log(`📞 Telecaller: ${tc.email} / Telecaller@1234`)
    } else console.log(`📞 ${tc.email} already exists`)
  }

  // Diseases
  let created = 0
  for (const d of diseases) {
    if (!await Disease.findOne({ name: d.name })) { await Disease.create(d); created++ }
  }
  console.log(`\n🏥 ${created} diseases seeded`)
  console.log('\n✅ Done!\n')
  console.log('─── Credentials ──────────────────────────────')
  console.log('Admin:      admin@patientcrm.com  / Admin@1234')
  console.log('Telecaller: priya@patientcrm.com  / Telecaller@1234')
  console.log('──────────────────────────────────────────────')

  await mongoose.disconnect()
}

seed().catch(e => { console.error(e); process.exit(1) })
