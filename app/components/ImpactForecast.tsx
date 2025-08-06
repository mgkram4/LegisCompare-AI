// app/components/ImpactForecast.tsx

interface Forecast {
  economic: string;
  social: string;
  political: string;
}

interface ImpactForecastData {
  assumptions: string[];
  short_term_1y: Forecast;
  medium_term_3y: Forecast;
  long_term_5y: Forecast;
}

function ForecastTimelineNode({ title, forecast, isLast = false }: { title: string, forecast: Forecast, isLast?: boolean }) {
    return (
        <div className="relative">
            {/* The vertical line */}
            {!isLast && <div className="absolute top-5 left-5 w-0.5 h-full bg-slate-300"></div>}
            
            <div className="flex items-start">
                {/* The circle */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-slate-400 flex items-center justify-center z-10">
                    <div className="w-4 h-4 rounded-full bg-slate-400"></div>
                </div>

                <div className="ml-6">
                    <h4 className="text-xl font-bold text-slate-800 mb-2">{title}</h4>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-3">
                        <p><span className="font-semibold text-blue-800">Economic:</span> <span className="text-black">{forecast.economic}</span></p>
                        <p><span className="font-semibold text-purple-800">Social:</span> <span className="text-black">{forecast.social}</span></p>
                        <p><span className="font-semibold text-green-800">Political:</span> <span className="text-black">{forecast.political}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ImpactForecast({ forecast, showAssumptions }: { forecast: ImpactForecastData, showAssumptions?: boolean }) {
  return (
    <section id="impact-forecast">
      <h2 className="text-2xl font-semibold text-slate-800 border-b-2 border-slate-300 pb-2 mb-6">
        Impact Forecast
      </h2>
      {showAssumptions && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Key Assumptions</h3>
          <ul className="list-disc list-inside bg-white border border-slate-200 p-4 rounded-md text-slate-600 shadow-sm">
              {forecast.assumptions.map((assumption, index) => (
                  <li key={index}>{assumption}</li>
              ))}
          </ul>
        </div>
      )}
      <div className="space-y-12">
        <ForecastTimelineNode title="Short Term (1 Year)" forecast={forecast.short_term_1y} />
        <ForecastTimelineNode title="Medium Term (3 Years)" forecast={forecast.medium_term_3y} />
        <ForecastTimelineNode title="Long Term (5 Years)" forecast={forecast.long_term_5y} isLast={true} />
      </div>
    </section>
  );
}
