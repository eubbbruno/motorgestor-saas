export interface PostTemplateProps {
  vehicle: {
    make?: string | null
    model?: string | null
    version?: string | null
    year?: number | null
    color?: string | null
    mileage?: number | null
    fuel?: string | null
    transmission?: string | null
    price?: number | null
  }
  company: {
    name: string
    logo_url?: string | null
  }
  primaryColor: string
  showPrice: boolean
  showMileage: boolean
  photoUrl?: string | null
}

function vehicleName(v: PostTemplateProps["vehicle"]) {
  return [v.make, v.model, v.version].filter(Boolean).join(" ") || "Veículo"
}

function fmtPrice(price: number | null | undefined) {
  if (price == null) return ""
  return `R$ ${Number(price).toLocaleString("pt-BR")}`
}

function fmtMileage(km: number | null | undefined) {
  if (km == null) return ""
  return `${Number(km).toLocaleString("pt-BR")} km`
}

// ─── Template 1: Dark Premium ─────────────────────────────────────────────────

export function DarkPremiumTemplate({
  vehicle,
  company,
  primaryColor,
  showPrice,
  showMileage,
  photoUrl,
}: PostTemplateProps) {
  const name = [vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Veículo"
  const version = vehicle.version ?? ""

  const details: string[] = [
    vehicle.color ? `🎨 ${vehicle.color}` : "",
    showMileage && vehicle.mileage != null ? `🛣️ ${fmtMileage(vehicle.mileage)}` : "",
    vehicle.fuel ? `⛽ ${vehicle.fuel}` : "",
    vehicle.transmission ? `⚙️ ${vehicle.transmission}` : "",
  ].filter(Boolean)

  return (
    <div
      style={{
        width: "1080px",
        height: "1080px",
        background: "linear-gradient(180deg, #0D1F1A 0%, #000000 100%)",
        position: "relative",
        fontFamily: "system-ui, -apple-system, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Photo */}
      {photoUrl ? (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "594px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={name}
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "240px",
              background: "linear-gradient(0deg, #000000 0%, transparent 100%)",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "594px",
            background: "linear-gradient(180deg, #1a3a2a 0%, #0D1F1A 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "120px",
          }}
        >
          🚗
        </div>
      )}

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "60px",
        }}
      >
        {/* Name */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "700",
            color: "#ffffff",
            lineHeight: "1.05",
            marginBottom: "6px",
          }}
        >
          {name}
        </div>
        {(version || vehicle.year) && (
          <div
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.55)",
              marginBottom: "20px",
            }}
          >
            {[version, vehicle.year].filter(Boolean).join(" · ")}
          </div>
        )}

        {/* Details */}
        {details.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              marginBottom: "28px",
            }}
          >
            {details.map((d) => (
              <span key={d} style={{ color: "rgba(255,255,255,0.65)", fontSize: "20px" }}>
                {d}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {showPrice && vehicle.price != null && (
          <div
            style={{
              fontSize: "60px",
              fontWeight: "800",
              color: primaryColor,
              marginBottom: "36px",
              lineHeight: "1",
            }}
          >
            {fmtPrice(vehicle.price)}
          </div>
        )}

        {/* Company footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "24px",
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
            {company.name}
          </div>
          {company.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logo_url}
              alt={company.name}
              crossOrigin="anonymous"
              style={{ height: "44px", objectFit: "contain" }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Template 2: White Clean ──────────────────────────────────────────────────

export function WhiteCleanTemplate({
  vehicle,
  company,
  primaryColor,
  showPrice,
  showMileage,
  photoUrl,
}: PostTemplateProps) {
  const name = [vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Veículo"
  const version = vehicle.version ?? ""

  const details: string[] = [
    vehicle.color ? `🎨 ${vehicle.color}` : "",
    showMileage && vehicle.mileage != null ? `🛣️ ${fmtMileage(vehicle.mileage)}` : "",
    vehicle.fuel ? `⛽ ${vehicle.fuel}` : "",
    vehicle.transmission ? `⚙️ ${vehicle.transmission}` : "",
  ].filter(Boolean)

  return (
    <div
      style={{
        width: "1080px",
        height: "1080px",
        background: "#ffffff",
        position: "relative",
        fontFamily: "system-ui, -apple-system, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Top strip */}
      <div style={{ height: "10px", background: primaryColor }} />

      {/* Photo */}
      {photoUrl ? (
        <div style={{ height: "526px", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={name}
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      ) : (
        <div
          style={{
            height: "526px",
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "120px",
          }}
        >
          🚗
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "48px 64px 0" }}>
        {vehicle.year && (
          <div style={{ fontSize: "16px", color: "#999", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "2px" }}>
            {vehicle.year}
          </div>
        )}
        <div style={{ fontSize: "54px", fontWeight: "800", color: "#111111", lineHeight: "1.05", marginBottom: "4px" }}>
          {name}
        </div>
        {version && (
          <div style={{ fontSize: "22px", color: "#666", marginBottom: "20px" }}>{version}</div>
        )}

        {details.length > 0 && (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "24px" }}>
            {details.map((d) => (
              <span key={d} style={{ color: "#555", fontSize: "20px" }}>
                {d}
              </span>
            ))}
          </div>
        )}

        {showPrice && vehicle.price != null && (
          <div style={{ fontSize: "52px", fontWeight: "800", color: primaryColor, lineHeight: "1" }}>
            {fmtPrice(vehicle.price)}
          </div>
        )}
      </div>

      {/* Company footer */}
      <div
        style={{
          position: "absolute",
          bottom: "44px",
          left: "64px",
          right: "64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #eee",
          paddingTop: "20px",
        }}
      >
        <div style={{ fontSize: "15px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
          {company.name}
        </div>
        {company.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={company.logo_url}
            alt={company.name}
            crossOrigin="anonymous"
            style={{ height: "40px", objectFit: "contain" }}
          />
        )}
      </div>
    </div>
  )
}

// ─── Template 3: Gradient Bold ────────────────────────────────────────────────

export function GradientBoldTemplate({
  vehicle,
  company,
  primaryColor,
  showPrice,
  showMileage,
  photoUrl,
}: PostTemplateProps) {
  const name = [vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Veículo"
  const version = vehicle.version ?? ""

  const details: string[] = [
    vehicle.color ? `🎨 ${vehicle.color}` : "",
    showMileage && vehicle.mileage != null ? `🛣️ ${fmtMileage(vehicle.mileage)}` : "",
    vehicle.fuel ? `⛽ ${vehicle.fuel}` : "",
    vehicle.transmission ? `⚙️ ${vehicle.transmission}` : "",
  ].filter(Boolean)

  return (
    <div
      style={{
        width: "1080px",
        height: "1080px",
        background: `linear-gradient(135deg, ${primaryColor} 0%, #000000 100%)`,
        position: "relative",
        fontFamily: "system-ui, -apple-system, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Right photo with diagonal clip */}
      {photoUrl && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "648px",
            height: "1080px",
            clipPath: "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={name}
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* fade into gradient on the left edge */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "280px",
              height: "100%",
              background: `linear-gradient(90deg, ${primaryColor} 0%, transparent 100%)`,
            }}
          />
        </div>
      )}

      {/* Left content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "520px",
          height: "100%",
          padding: "80px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Logo / company top */}
        <div>
          {company.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logo_url}
              alt={company.name}
              crossOrigin="anonymous"
              style={{ height: "44px", objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            >
              {company.name}
            </div>
          )}
        </div>

        {/* Main content */}
        <div>
          {vehicle.year && (
            <div
              style={{
                fontSize: "18px",
                color: "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
                letterSpacing: "4px",
                marginBottom: "12px",
              }}
            >
              {vehicle.year}
            </div>
          )}

          <div style={{ fontSize: "68px", fontWeight: "900", color: "#ffffff", lineHeight: "1", marginBottom: "6px" }}>
            {name}
          </div>

          {version && (
            <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.65)", marginBottom: "36px" }}>
              {version}
            </div>
          )}

          {details.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "44px" }}>
              {details.map((d) => (
                <span key={d} style={{ color: "rgba(255,255,255,0.8)", fontSize: "20px" }}>
                  {d}
                </span>
              ))}
            </div>
          )}

          {showPrice && vehicle.price != null && (
            <div style={{ fontSize: "56px", fontWeight: "900", color: "#ffffff", lineHeight: "1" }}>
              {fmtPrice(vehicle.price)}
            </div>
          )}
        </div>

        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "2px" }}>
          motorgestor.com.br
        </div>
      </div>
    </div>
  )
}
