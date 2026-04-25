import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { Search, Package, MapPin, Truck, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, found, error

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setStatus('loading');
    
    // Simulate network parsing
    setTimeout(() => {
      // Secret error trigger if they specifically type "ERROR"
      if (orderId.trim().toUpperCase() === 'ERROR') {
        setStatus('error');
      } else {
        setStatus('found');
      }
    }, 1500);
  };

  // Static mockup steps showing active states
  const steps = [
    { label: 'Order Confirmed', desc: 'We received your order securely.', time: '2 days ago', icon: CheckCircle, isCompleted: true },
    { label: 'Freshly Packed', desc: 'Your authentic pickles are sealed.', time: 'Yesterday', icon: Package, isCompleted: true },
    { label: 'In Transit', desc: 'Handed over to BlueDart logistics.', time: 'Today, 09:12 AM', icon: Truck, isCompleted: true },
    { label: 'Out for Delivery', desc: 'Package is arriving to your location.', time: 'Pending', icon: MapPin, isCurrent: true, isCompleted: false },
    { label: 'Delivered', desc: 'Enjoy the authentic taste of Andhra!', time: '', icon: CheckCircle, isCompleted: false },
  ];

  return (
    <>
      <Head>
        <title>Track Order | Andhra Store</title>
        <meta name="description" content="Track your Andhra Store pickle delivery status in real-time." />
      </Head>
      <Header />

      <main className="min-h-[75vh] bg-gray-50/50 py-10 sm:py-16">
        <div className="container-main max-w-2xl">
          
          {/* Header Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-heading text-gray-900 mb-3">Track Your Order</h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Enter your Order ID below to receive real-time shipping updates on your authentic Andhra delicacies.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  placeholder="e.g. ANDHRA-84729"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all font-medium text-gray-700 uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:font-normal"
                  required
                />
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={20} />
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading' || !orderId.trim()}
                className="inline-flex items-center justify-center gap-2 bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-600 active:scale-95 transition-all shadow-md shadow-brand-500/20 disabled:opacity-70 disabled:active:scale-100"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={18} />
                    Track
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Dynamic Results Area */}
          <div className="transition-all duration-500">
            
            {status === 'idle' && (
              <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-brand-500" size={28} />
                </div>
                <h3 className="text-gray-900 font-bold mb-1">Ready to locate your package</h3>
                <p className="text-gray-400 text-sm">Valid Order ID is sent to your email and WhatsApp.</p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center p-10 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-red-500" size={28} />
                </div>
                <h3 className="text-red-800 font-bold mb-1">Order Not Found</h3>
                <p className="text-red-600/70 text-sm max-w-sm mx-auto">
                  We couldn&apos;t locate an active order with ID &ldquo;{orderId.toUpperCase()}&rdquo;. Please check your spelling and try again.
                </p>
              </div>
            )}

            {status === 'found' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                
                {/* Order Summary Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 mb-8 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Order ID</p>
                    <p className="text-xl font-black text-gray-900 tracking-wider">#{orderId.toUpperCase()}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Estimated Delivery</p>
                    <p className="text-brand-600 font-bold">Arriving Today by 8 PM</p>
                  </div>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-4 sm:pl-8 space-y-8 pb-4">
                  
                  {/* The background connecting line */}
                  <div className="absolute top-2 bottom-6 left-8 sm:left-12 w-0.5 bg-gray-100 rounded-full" />
                  
                  {/* The active progress connecting line (simulates 65% completion) */}
                  <div className="absolute top-2 bottom-6 left-8 sm:left-12 w-0.5 bg-brand-500 rounded-full origin-top" style={{ height: '70%' }} />

                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={idx} className="relative flex items-start gap-5 sm:gap-8 group">
                        
                        {/* Timeline Note / Icon Area */}
                        <div className="relative z-10">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-[3px] shadow-sm transition-colors duration-300 ${
                            step.isCompleted 
                              ? 'bg-brand-500 border-white text-white' 
                              : step.isCurrent
                              ? 'bg-white border-brand-500 text-brand-500 animate-pulse'
                              : 'bg-gray-50 border-white text-gray-300'
                          }`}>
                            <Icon size={16} strokeWidth={step.isCompleted ? 3 : 2} />
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 pt-1.5 pb-2">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                            <h4 className={`text-base font-bold ${
                              step.isCompleted || step.isCurrent ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </h4>
                            {step.time && (
                              <span className={`text-xs font-semibold flex items-center gap-1 ${
                                step.isCurrent ? 'text-brand-600' : 'text-gray-400'
                              }`}>
                                <Clock size={12} />
                                {step.time}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            step.isCompleted || step.isCurrent ? 'text-gray-500' : 'text-gray-300'
                          }`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Tracking Actions */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                  <Link href="https://wa.me/918758302568" target="_blank" className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-100 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Contact Support
                  </Link>
                  <button onClick={() => setStatus('idle')} className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                    Track Another
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
