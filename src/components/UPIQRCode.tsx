import { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Clock, AlertCircle, Smartphone } from 'lucide-react';
import { formatPriceSimple } from '@/utils/currency';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { paymentService, UPIPaymentRequest } from '@/services/paymentService';

interface UPIQRCodeProps {
  amount: number;
  merchantId?: string;
  merchantName?: string;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentFailure: (error: string) => void;
}

type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

const UPIQRCode = ({ 
  amount, 
  merchantId = 'merchant@paytm', 
  merchantName = 'ShopEase',
  onPaymentSuccess,
  onPaymentFailure
}: UPIQRCodeProps) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [transactionId, setTransactionId] = useState<string>('');
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);

  const generateUPIString = () => {
    const txId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    setTransactionId(txId);
    return `upi://pay?pa=${merchantId}&pn=${merchantName}&am=${amount.toFixed(2)}&tr=${txId}&tn=Payment for Order`;
  };

  const checkPaymentStatus = async () => {
    if (!transactionId) return;
    
    setIsCheckingPayment(true);
    setVerificationAttempts(prev => prev + 1);
    
    try {
      const paymentRequest: UPIPaymentRequest = {
        transactionId,
        amount,
        merchantId,
        merchantName
      };

      const response = await paymentService.verifyUPIPayment(paymentRequest);
      
      if (response.status === 'completed') {
        setPaymentStatus('completed');
        toast.success('🎉 Payment verified successfully!');
        onPaymentSuccess(transactionId);
      } else if (response.status === 'failed') {
        setPaymentStatus('failed');
        toast.error(`❌ Payment failed: ${response.errorMessage || 'Unknown error'}`);
        onPaymentFailure(response.errorMessage || 'Payment failed');
      } else {
        // Still pending, continue polling
        setPaymentStatus('processing');
        toast.info('⏳ Payment still processing, checking again...');
      }
    } catch (error) {
      setPaymentStatus('failed');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`❌ Error checking payment status: ${errorMessage}`);
      onPaymentFailure(errorMessage);
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const retryPayment = () => {
    setPaymentStatus('pending');
    setTransactionId('');
    setVerificationAttempts(0);
    setCountdown(3);
    setShowCountdown(false);
  };

  const startAutoVerification = async () => {
    if (!transactionId) return;
    
    try {
      const paymentRequest: UPIPaymentRequest = {
        transactionId,
        amount,
        merchantId,
        merchantName
      };

      // Use the polling service to continuously check payment status
      const response = await paymentService.pollUPIPaymentStatus(paymentRequest, 15, 3000);
      
      if (response.status === 'completed') {
        setPaymentStatus('completed');
        toast.success('🎉 Payment verified successfully!');
        onPaymentSuccess(transactionId);
      }
    } catch (error) {
      setPaymentStatus('failed');
      const errorMessage = error instanceof Error ? error.message : 'Payment verification timeout';
      toast.error(`❌ ${errorMessage}`);
      onPaymentFailure(errorMessage);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
      startAutoVerification();
    }
  }, [showCountdown, countdown]);

  useEffect(() => {
    // Auto-start verification when transaction ID is generated
    if (transactionId && paymentStatus === 'pending') {
      // Show countdown for 3 seconds before starting auto-verification
      setShowCountdown(true);
    }
  }, [transactionId, paymentStatus]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'processing':
        return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'completed':
        return 'Payment Completed!';
      case 'failed':
        return 'Payment Failed';
      case 'processing':
        return `Verifying Payment... (Attempt ${verificationAttempts})`;
      default:
        return 'Waiting for Payment...';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 border rounded-lg bg-white">
      {/* Payment Status */}
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <span className={`font-semibold ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Countdown Timer */}
      {showCountdown && (
        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {countdown}
          </div>
          <p className="text-sm text-blue-800">
            Starting payment verification in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </div>
      )}

      {/* QR Code */}
      <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center relative">
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(generateUPIString())}`}
          alt="UPI QR Code"
          className="w-44 h-44"
        />
        
        {/* Scan Animation Overlay */}
        {paymentStatus === 'pending' && !showCountdown && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-primary border-dashed rounded-lg animate-pulse opacity-50"></div>
          </div>
        )}
      </div>

      {/* Transaction Details */}
      <div className="text-center space-y-3">
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center justify-center gap-2">
            <Smartphone className="w-4 h-4" />
            Scan with any UPI app
          </p>
          <p className="text-xs text-muted-foreground">
            Amount: {formatPriceSimple(amount)}
          </p>
          {transactionId && (
            <p className="text-xs text-muted-foreground font-mono bg-gray-100 px-2 py-1 rounded">
              TXN: {transactionId}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Supported:</span>
          <span className="font-medium">PhonePe • Paytm • GPay • BHIM</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full">
        {paymentStatus === 'pending' && !showCountdown && (
          <Button 
            onClick={checkPaymentStatus}
            disabled={isCheckingPayment || !transactionId}
            variant="outline"
            className="w-full"
          >
            {isCheckingPayment ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                Checking Payment...
              </>
            ) : (
              'Check Payment Status'
            )}
          </Button>
        )}
        
        {paymentStatus === 'processing' && (
          <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              🔄 Auto-verifying payment... Please wait
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Attempt {verificationAttempts} of 15
            </p>
          </div>
        )}
        
        {paymentStatus === 'failed' && (
          <Button 
            onClick={retryPayment}
            className="w-full"
          >
            Try Again
          </Button>
        )}
        
        {paymentStatus === 'completed' && (
          <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✅ Payment successful! Redirecting...
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>1. Open any UPI app on your phone</p>
        <p>2. Scan this QR code</p>
        <p>3. Complete the payment</p>
        <p>4. Payment will be auto-verified in 3 seconds</p>
        <p>5. Or manually click "Check Payment Status"</p>
      </div>
    </div>
  );
};

export default UPIQRCode;