import { PrismaClient, Role, QueueStatus, ProcurementStatus, PaymentStatus, CentreStatus, DemandLevel, TimeWindow, NotificationEvent, NotificationChannel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting MandiMitra database seed...');

  // Clean existing data in reverse order of foreign keys
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.demandMetric.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.procurement.deleteMany();
  await prisma.queueEvent.deleteMany();
  await prisma.queueToken.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.centreOperator.deleteMany();
  await prisma.centre.deleteMany();
  await prisma.farmer.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);
  const operatorPasswordHash = await bcrypt.hash('operator123', salt);
  const cscPasswordHash = await bcrypt.hash('csc123', salt);

  // 1. Create Centres
  console.log('Creating Procurement Centres...');
  const centreA = await prisma.centre.create({
    data: {
      code: 'MANDI-LSL',
      name: 'Mandi Centre A - Lasalgaon APMC',
      address: 'APMC Market Yard, Station Road, Lasalgaon',
      district: 'Nashik',
      taluka: 'Niphad',
      state: 'Maharashtra',
      latitude: 20.1472,
      longitude: 74.2256,
      capacity: 120,
      activeCounters: 4,
      avgProcessingMinutes: 8.5,
      openingTime: '08:00',
      closingTime: '18:00',
      status: CentreStatus.ACTIVE,
      supportedCrops: ['Onion', 'Wheat', 'Soybean', 'Gram'],
    },
  });

  const centreB = await prisma.centre.create({
    data: {
      code: 'MANDI-NPH',
      name: 'Mandi Centre B - Niphad Grain Hub',
      address: 'Near Railway Station, Niphad Market Committee',
      district: 'Nashik',
      taluka: 'Niphad',
      state: 'Maharashtra',
      latitude: 20.0822,
      longitude: 74.1132,
      capacity: 90,
      activeCounters: 4,
      avgProcessingMinutes: 6.5,
      openingTime: '08:00',
      closingTime: '18:00',
      status: CentreStatus.ACTIVE,
      supportedCrops: ['Wheat', 'Soybean', 'Onion', 'Maize'],
    },
  });

  const centreC = await prisma.centre.create({
    data: {
      code: 'MANDI-YLA',
      name: 'Mandi Centre C - Yeola Sub-Market Yard',
      address: 'Manmad-Ahmednagar Highway, Yeola',
      district: 'Nashik',
      taluka: 'Yeola',
      state: 'Maharashtra',
      latitude: 20.0422,
      longitude: 74.4891,
      capacity: 100,
      activeCounters: 4,
      avgProcessingMinutes: 7.0,
      openingTime: '08:30',
      closingTime: '17:30',
      status: CentreStatus.ACTIVE,
      supportedCrops: ['Onion', 'Gram', 'Cotton', 'Wheat'],
    },
  });

  const centreD = await prisma.centre.create({
    data: {
      code: 'MANDI-SNR',
      name: 'Mandi Centre D - Sinnar Agro Centre',
      address: 'Industrial Area Bypass, Sinnar',
      district: 'Nashik',
      taluka: 'Sinnar',
      state: 'Maharashtra',
      latitude: 19.8512,
      longitude: 73.9984,
      capacity: 70,
      activeCounters: 2,
      avgProcessingMinutes: 10.0,
      openingTime: '09:00',
      closingTime: '17:00',
      status: CentreStatus.OVERLOADED,
      supportedCrops: ['Soybean', 'Wheat', 'Bajra'],
    },
  });

  // 2. Create Users & Profiles
  console.log('Creating Users...');

  // Admin User
  const adminUser = await prisma.user.create({
    data: {
      mobile: '9876543210',
      email: 'admin@mandimitra.gov.in',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      admin: {
        create: {
          fullName: 'Rajeshwar Rao',
          department: 'Agricultural Marketing & State Procurement',
          designation: 'District Procurement Officer',
        },
      },
    },
  });

  // Centre B Operator
  const operatorUser = await prisma.user.create({
    data: {
      mobile: '9876543211',
      email: 'operator.niphad@mandimitra.gov.in',
      passwordHash: operatorPasswordHash,
      role: Role.OPERATOR,
      operator: {
        create: {
          fullName: 'Suresh Gaikwad',
          centreId: centreB.id,
          counterNumber: 1,
          isActive: true,
        },
      },
    },
  });

  // CSC Assisted Operator
  const cscUser = await prisma.user.create({
    data: {
      mobile: '9876543212',
      email: 'csc.niphad@csc.gov.in',
      passwordHash: cscPasswordHash,
      role: Role.CSC_OPERATOR,
    },
  });

  // Demo Farmer 1: Ramesh Kumar
  const rameshUser = await prisma.user.create({
    data: {
      mobile: '9822012345',
      role: Role.FARMER,
      farmer: {
        create: {
          farmerId: 'MH-NAS-2026-0812',
          fullName: 'Ramesh Kumar',
          mobile: '9822012345',
          village: 'Pimpalgaon Baswant',
          taluka: 'Niphad',
          district: 'Nashik',
          state: 'Maharashtra',
          preferredLanguage: 'hi',
          defaultCrop: 'Wheat',
          defaultQuantity: 85.0,
          preferredCentreId: centreB.id,
          registrationStatus: 'VERIFIED',
        },
      },
    },
    include: { farmer: true },
  });

  // Demo Farmer 2: Sunita Patil
  const sunitaUser = await prisma.user.create({
    data: {
      mobile: '9822054321',
      role: Role.FARMER,
      farmer: {
        create: {
          farmerId: 'MH-NAS-2026-0490',
          fullName: 'Sunita Patil',
          mobile: '9822054321',
          village: 'Chandori',
          taluka: 'Niphad',
          district: 'Nashik',
          state: 'Maharashtra',
          preferredLanguage: 'mr',
          defaultCrop: 'Onion',
          defaultQuantity: 120.0,
          preferredCentreId: centreA.id,
          registrationStatus: 'VERIFIED',
        },
      },
    },
    include: { farmer: true },
  });

  // Demo Farmer 3: Tukaram Shinde
  const tukaramUser = await prisma.user.create({
    data: {
      mobile: '9822098765',
      role: Role.FARMER,
      farmer: {
        create: {
          farmerId: 'MH-NAS-2026-1102',
          fullName: 'Tukaram Shinde',
          mobile: '9822098765',
          village: 'Vinchur',
          taluka: 'Yeola',
          district: 'Nashik',
          state: 'Maharashtra',
          preferredLanguage: 'mr',
          defaultCrop: 'Soybean',
          defaultQuantity: 65.0,
          preferredCentreId: centreC.id,
          registrationStatus: 'VERIFIED',
        },
      },
    },
    include: { farmer: true },
  });

  // 3. Create Slots for Today across centres
  console.log('Generating dynamic procurement slots...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const slotTimes = [
    { start: '08:30', end: '09:00', window: TimeWindow.MORNING },
    { start: '09:00', end: '09:30', window: TimeWindow.MORNING },
    { start: '09:30', end: '10:00', window: TimeWindow.MORNING },
    { start: '10:00', end: '10:30', window: TimeWindow.MORNING },
    { start: '10:30', end: '11:00', window: TimeWindow.MORNING },
    { start: '11:00', end: '11:30', window: TimeWindow.MORNING },
    { start: '11:30', end: '12:00', window: TimeWindow.MORNING },
    { start: '12:00', end: '12:30', window: TimeWindow.AFTERNOON },
    { start: '12:30', end: '13:00', window: TimeWindow.AFTERNOON },
    { start: '13:00', end: '13:30', window: TimeWindow.AFTERNOON },
    { start: '13:30', end: '14:00', window: TimeWindow.AFTERNOON },
    { start: '14:00', end: '14:30', window: TimeWindow.AFTERNOON },
    { start: '14:30', end: '15:00', window: TimeWindow.AFTERNOON },
    { start: '15:00', end: '15:30', window: TimeWindow.AFTERNOON },
    { start: '15:30', end: '16:00', window: TimeWindow.AFTERNOON },
    { start: '16:00', end: '16:30', window: TimeWindow.EVENING },
    { start: '16:30', end: '17:00', window: TimeWindow.EVENING },
  ];

  const centres = [centreA, centreB, centreC, centreD];
  let rameshSlot = null;

  for (const centre of centres) {
    for (const [index, st] of slotTimes.entries()) {
      // Simulate dynamic bookings per slot
      let currentBookings = Math.floor(Math.random() * 8) + 2;
      if (centre.id === centreD.id) currentBookings = 15; // full

      const slot = await prisma.slot.create({
        data: {
          centreId: centre.id,
          date: today,
          startTime: st.start,
          endTime: st.end,
          maxCapacity: 15,
          currentBookings: currentBookings,
          bufferCapacity: 3,
          isBlocked: currentBookings >= 15,
          timeWindow: st.window,
        },
      });

      if (centre.id === centreB.id && st.start === '12:30') {
        rameshSlot = slot;
      }
    }
  }

  // 4. Create Ramesh's Active Booking and Token (Demo Scenario!)
  console.log('Seeding Ramesh active booking & token B-042...');
  const rameshBooking = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2026-NPH-042',
      farmerId: rameshUser.farmer!.id,
      centreId: centreB.id,
      slotId: rameshSlot!.id,
      date: today,
      startTime: '12:30',
      endTime: '13:00',
      crop: 'Wheat',
      quantity: 85.0,
      estimatedWaitMinutes: 28,
      status: 'CONFIRMED',
      isAssisted: false,
    },
  });

  // Calculate arrival & departure time estimates
  const estServiceTime = new Date();
  estServiceTime.setHours(12, 48, 0, 0);

  const departureTime = new Date(estServiceTime.getTime() - (25 + 20) * 60 * 1000); // 45 min buffer + travel

  const rameshToken = await prisma.queueToken.create({
    data: {
      tokenNumber: 'B-042',
      prefix: 'B',
      sequenceNumber: 42,
      farmerId: rameshUser.farmer!.id,
      centreId: centreB.id,
      bookingId: rameshBooking.id,
      queuePosition: 7,
      appointmentDate: today,
      appointmentTime: '12:30',
      status: QueueStatus.CHECKED_IN,
      isPriority: false,
      createdTime: new Date(today.getTime() + 8 * 3600 * 1000),
      arrivalTime: new Date(),
      departureRecommendedAt: departureTime,
      estimatedServiceTime: estServiceTime,
      travelTimeMinutes: 25,
    },
  });

  // Create queue event for Ramesh
  await prisma.queueEvent.create({
    data: {
      tokenId: rameshToken.id,
      previousStatus: QueueStatus.BOOKED,
      newStatus: QueueStatus.CHECKED_IN,
      eventType: 'FARMER_CHECK_IN',
      notes: 'Farmer arrived at Centre B gate and checked in via mobile token',
      actorId: rameshUser.farmer!.id,
      actorRole: 'FARMER',
    },
  });

  // Seed prior queue tokens for Centre B to create the exact live queue from Section 10 & 47:
  // Serving: B-035, Next: B-036, Waiting: B-037, B-038, B-039, B-040, B-041, then Ramesh (B-042)!
  console.log('Seeding Centre B live queue sequence (B-035 to B-041)...');
  const dummyNames = [
    'Devidas More', 'Ganesh Jadhav', 'Balasaheb Shirole', 'Kishor Wagh',
    'Pandurang Kale', 'Arun Thorat', 'Vishnu Sanap'
  ];

  const queueStatuses = [
    { num: 35, status: QueueStatus.PROCESSING, pos: 0, counter: 1 },
    { num: 36, status: QueueStatus.CALLED, pos: 1, counter: 2 },
    { num: 37, status: QueueStatus.WAITING, pos: 2, counter: null },
    { num: 38, status: QueueStatus.WAITING, pos: 3, counter: null },
    { num: 39, status: QueueStatus.WAITING, pos: 4, counter: null },
    { num: 40, status: QueueStatus.WAITING, pos: 5, counter: null },
    { num: 41, status: QueueStatus.WAITING, pos: 6, counter: null },
  ];

  for (let i = 0; i < queueStatuses.length; i++) {
    const item = queueStatuses[i];
    const farmerUser = await prisma.user.create({
      data: {
        mobile: `98220000${item.num}`,
        role: Role.FARMER,
        farmer: {
          create: {
            farmerId: `MH-NAS-2026-00${item.num}`,
            fullName: dummyNames[i],
            mobile: `98220000${item.num}`,
            village: 'Niphad Rural',
            taluka: 'Niphad',
            district: 'Nashik',
            state: 'Maharashtra',
            preferredLanguage: 'mr',
            defaultCrop: 'Wheat',
            defaultQuantity: 60.0,
            registrationStatus: 'VERIFIED',
          },
        },
      },
      include: { farmer: true },
    });

    const token = await prisma.queueToken.create({
      data: {
        tokenNumber: `B-0${item.num}`,
        prefix: 'B',
        sequenceNumber: item.num,
        farmerId: farmerUser.farmer!.id,
        centreId: centreB.id,
        queuePosition: item.pos,
        appointmentDate: today,
        appointmentTime: '12:00',
        status: item.status,
        counterNumber: item.counter,
        createdTime: new Date(today.getTime() + 9 * 3600 * 1000),
        arrivalTime: new Date(),
        callTime: item.status === QueueStatus.CALLED || item.status === QueueStatus.PROCESSING ? new Date() : null,
        processingStartTime: item.status === QueueStatus.PROCESSING ? new Date() : null,
        travelTimeMinutes: 20,
      },
    });

    await prisma.queueEvent.create({
      data: {
        tokenId: token.id,
        previousStatus: QueueStatus.WAITING,
        newStatus: item.status,
        eventType: item.status === QueueStatus.PROCESSING ? 'PROCESSING_STARTED' : (item.status === QueueStatus.CALLED ? 'TOKEN_CALLED' : 'TOKEN_QUEUED'),
        notes: `Token B-0${item.num} transitioned to ${item.status}`,
        actorRole: 'OPERATOR',
      },
    });
  }

  // 5. Seed Past Procurements & Payment for Ramesh & Sunita
  console.log('Seeding Procurements & Payments...');
  const pastProcurement = await prisma.procurement.create({
    data: {
      procurementNumber: 'PROC-2026-0920-881',
      farmerId: rameshUser.farmer!.id,
      centreId: centreA.id,
      crop: 'Onion',
      quantity: 120.0, // quintals
      grade: 'Grade A (Red Globe)',
      moistureContent: 11.2,
      bagCount: 240,
      ratePerQuintal: 2270.0,
      totalAmount: 272400.0,
      status: ProcurementStatus.COMPLETED,
      arrivalTime: new Date(today.getTime() - 4 * 86400 * 1000),
      processingStart: new Date(today.getTime() - 4 * 86400 * 1000 + 3600 * 1000),
      processingCompletion: new Date(today.getTime() - 4 * 86400 * 1000 + 7200 * 1000),
      remarks: 'Quality verified by Quality Assayer. Direct procurement under MSP Scheme.',
    },
  });

  await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2026-NAS-4421',
      procurementId: pastProcurement.id,
      farmerId: rameshUser.farmer!.id,
      amount: 272400.0,
      status: PaymentStatus.PROCESSING,
      paymentMethod: 'DBT_DIRECT_BENEFIT',
      transactionRef: 'DBT202609210049281',
      bankAccountLast4: '4821',
      ifscCode: 'SBIN0001234',
      initiatedAt: new Date(today.getTime() - 2 * 86400 * 1000),
      remarks: 'Direct Benefit Transfer (DBT) to Aadhaar-linked Bank Account. Approved by Treasury.',
    },
  });

  // Sunita Completed Procurement & Payment
  const sunitaProc = await prisma.procurement.create({
    data: {
      procurementNumber: 'PROC-2026-0918-654',
      farmerId: sunitaUser.farmer!.id,
      centreId: centreA.id,
      crop: 'Soybean',
      quantity: 90.0,
      grade: 'Grade A',
      moistureContent: 10.5,
      bagCount: 180,
      ratePerQuintal: 4892.0,
      totalAmount: 440280.0,
      status: ProcurementStatus.COMPLETED,
      arrivalTime: new Date(today.getTime() - 6 * 86400 * 1000),
      processingStart: new Date(today.getTime() - 6 * 86400 * 1000 + 1800 * 1000),
      processingCompletion: new Date(today.getTime() - 6 * 86400 * 1000 + 4500 * 1000),
    },
  });

  await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2026-NAS-3199',
      procurementId: sunitaProc.id,
      farmerId: sunitaUser.farmer!.id,
      amount: 440280.0,
      status: PaymentStatus.COMPLETED,
      paymentMethod: 'DBT_DIRECT_BENEFIT',
      transactionRef: 'DBT202609190088192',
      bankAccountLast4: '1942',
      ifscCode: 'MAHB0000451',
      initiatedAt: new Date(today.getTime() - 5 * 86400 * 1000),
      completedAt: new Date(today.getTime() - 3 * 86400 * 1000),
      remarks: 'Disbursed successfully to Bank of Maharashtra A/C ending in 1942',
    },
  });

  // 6. Demand Metrics for Digital Twin & Analytics
  console.log('Seeding Demand Metrics & Digital Twin operational data...');
  const windows = [TimeWindow.MORNING, TimeWindow.AFTERNOON, TimeWindow.EVENING];

  for (const centre of centres) {
    for (const w of windows) {
      let curDemand: DemandLevel = DemandLevel.MODERATE;
      let expDemand: DemandLevel = DemandLevel.HIGH;
      let queuePressure = 0.55;
      let capUtil = 0.65;
      let throughput = 8.2;

      if (centre.id === centreB.id) {
        curDemand = DemandLevel.MODERATE;
        expDemand = DemandLevel.MODERATE;
        queuePressure = 0.45;
        capUtil = 0.62;
        throughput = 9.1;
      } else if (centre.id === centreD.id) {
        curDemand = DemandLevel.CRITICAL;
        expDemand = DemandLevel.CRITICAL;
        queuePressure = 0.92;
        capUtil = 0.96;
        throughput = 4.8;
      }

      await prisma.demandMetric.create({
        data: {
          centreId: centre.id,
          date: today,
          timeWindow: w,
          currentDemand: curDemand,
          expectedDemand: expDemand,
          queuePressure: queuePressure,
          capacityUtilization: capUtil,
          processingThroughput: throughput,
          slotPressure: capUtil * 0.95,
          trend: centre.id === centreD.id ? 'RISING' : 'STABLE',
          recommendedAction: centre.id === centreD.id ? 'Increase active counters and redirect incoming farmers to Centre B or C' : 'Maintain standard operation rate',
        },
      });
    }
  }

  // 7. Seed Operational Alerts
  console.log('Seeding Alerts...');
  await prisma.alert.create({
    data: {
      centreId: centreD.id,
      title: 'High Queue Pressure & Overload Alert',
      message: 'Mandi Centre D queue has exceeded 90% threshold with 2 active counters.',
      severity: 'CRITICAL',
      alertType: 'QUEUE_THRESHOLD',
      suggestedAction: 'Redirect new online bookings to Mandi Centre B (Niphad Grain Hub) which has 4 open counters and lower wait times.',
      isResolved: false,
    },
  });

  await prisma.alert.create({
    data: {
      centreId: centreA.id,
      title: 'Moisture Analyzer Calibration Notice',
      message: 'Counter 3 electronic grain moisture meter scheduled for routine recalibration at 14:00.',
      severity: 'INFO',
      alertType: 'PROCESSING_BOTTLENECK',
      suggestedAction: 'Reroute moisture verification to Counter 2 during calibration.',
      isResolved: false,
    },
  });

  // 8. Seed Notifications for Ramesh
  console.log('Seeding Farmer Notifications...');
  await prisma.notification.create({
    data: {
      farmerId: rameshUser.farmer!.id,
      title: 'Smart Departure Alert',
      message: 'You have 6 farmers ahead at Mandi Centre B. Estimated call time is 11:42 AM. Recommended departure time: 11:15 AM.',
      eventType: NotificationEvent.QUEUE_APPROACHING,
      channel: NotificationChannel.IN_APP,
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      farmerId: rameshUser.farmer!.id,
      title: 'Token Confirmed: B-042',
      message: 'Your token B-042 for Mandi Centre B is confirmed for today 12:30 PM slot. Track live queue on MandiMitra.',
      eventType: NotificationEvent.TOKEN_GENERATED,
      channel: NotificationChannel.SMS,
      isRead: true,
    },
  });

  // 9. Seed Audit Logs
  console.log('Seeding Audit Trail...');
  await prisma.auditLog.create({
    data: {
      actor: 'Suresh Gaikwad',
      actorRole: 'OPERATOR',
      action: 'CALL_TOKEN',
      entity: 'QueueToken',
      entityId: 'B-036',
      metadata: { counter: 2, timestamp: new Date() },
    },
  });

  await prisma.auditLog.create({
    data: {
      actor: 'Ramesh Kumar',
      actorRole: 'FARMER',
      action: 'BOOK_SLOT',
      entity: 'Booking',
      entityId: rameshBooking.id,
      metadata: { centre: 'Mandi Centre B', slot: '12:30 - 13:00', crop: 'Wheat' },
    },
  });

  console.log('✅ MandiMitra database successfully seeded with realistic procurement data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
